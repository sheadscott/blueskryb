import { logger, wait } from '@trigger.dev/sdk/v3'

export type IndustryIdentifier = { type: string; identifier: string }
export type GoogleBook = {
  volumeInfo: { industryIdentifiers?: IndustryIdentifier[]; title?: string }
}

const googleApiKey = process.env.GOOGLE_API_KEY
const braveApiKey = process.env.BRAVE_API_KEY

function stringToQueryParam(str: string, title: boolean = false) {
  if (title) {
    str = str.split(':')[0].split('(')[0]
  }
  // Remove more than one space from the string
  str = str.replace(/\s+/g, ' ')
  // html encode the string
  str = encodeURIComponent(str)
  // Replace URL-encoded spaces (%20) with '+'
  str = str.replace(/%20/g, '+')
  return str
}

export async function getIsbn13sFromBrave(
  title: string,
  author: string
): Promise<string[] | null> {
  title = stringToQueryParam(title, true)
  author = stringToQueryParam(author)

  await wait.for({ seconds: 1 })

  const braveUrl = `https://api.search.brave.com/res/v1/web/search?q=${title}+${author}+isbn+book&result_filter=web`
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Accept-Encoding': 'gzip',
  }
  if (braveApiKey) headers['X-Subscription-Token'] = braveApiKey

  const braveRes = await fetch(braveUrl, { headers })
  logger.log(`Brave response: ${braveRes.status}`)
  const braveData = await braveRes.text()

  const regex = /97(?:-?\d){11}/g
  const isbn13 = braveData.match(regex)
  if (isbn13) {
    // Remove dashes and filter to only 13-digit strings
    const normalized = isbn13
      .map((isbn) => isbn.replace(/-/g, ''))
      .filter((isbn) => /^\d{13}$/.test(isbn))
    logger.log(`Brave ISBN13s: ${normalized}`)
    return normalized.length > 0 ? normalized : null
  }
  return null
}

export async function getIsbn13sFromGoogleBooks(
  title: string,
  author: string
): Promise<string[] | null> {
  title = stringToQueryParam(title, true)
  author = stringToQueryParam(author)

  const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=+intitle:${title}+inauthor:${author}&key=${googleApiKey}`
  logger.log(`Google Books URL: ${googleBooksUrl}`)
  const googleRes = await fetch(googleBooksUrl)
  const googleData = await googleRes.json()
  const googleBooks: GoogleBook[] = googleData.items || []
  const isbn13s = googleBooks.flatMap(
    (book) =>
      book.volumeInfo.industryIdentifiers
        ?.filter((i) => i.type === 'ISBN_13')
        .map((i) => i.identifier) || []
  )
  return isbn13s.length > 0 ? isbn13s : null
}

function findValidBookshopIsbn13(
  isbn13s: string[] | null
): Promise<string | null> {
  if (!isbn13s) return Promise.resolve(null)
  return (async () => {
    for (const isbn13 of isbn13s) {
      const url = `https://bookshop.org/book/${isbn13}`
      const res = await fetch(url, { method: 'HEAD' })
      if (res.status === 200) {
        return isbn13
      }
    }
    return null
  })()
}

export async function findBookshopIsbn13GoogleBooks(
  title: string,
  author: string
): Promise<string | null> {
  const isbn13s = await getIsbn13sFromGoogleBooks(title, author)
  return findValidBookshopIsbn13(isbn13s)
}

export async function findBookshopIsbn13Brave(
  title: string,
  author: string
): Promise<string | null> {
  const isbn13s = await getIsbn13sFromBrave(title, author)
  return findValidBookshopIsbn13(isbn13s)
}

export interface BookshopIsbn13LookupInput {
  isbn13?: string
  isbn?: string
  title: string
  author: string
}

async function fetchBookshopIsbn13WithRetry(
  isbn13: string,
  maxAttempts = 10
): Promise<200 | 404 | null> {
  const url = `https://bookshop.org/book/${isbn13}`
  let attempt = 0
  while (attempt < maxAttempts) {
    try {
      const res = await fetch(url, { method: 'HEAD' })
      if (res.status === 200) return 200
      if (res.status === 404) return 404
      if (res.status === 429) {
        const retryAfter: number = Number(res.headers.get('retry-after')) || 66
        logger.log(
          `Bookshop.org rate limit hit for ${isbn13}. Waiting ${retryAfter} seconds...`
        )
        await wait.for({ seconds: retryAfter })
      } else {
        logger.log(
          `Bookshop.org unexpected status ${res.status} for ${isbn13}. Retrying...`
        )
      }
    } catch (err) {
      logger.error(`Error fetching Bookshop.org for ${isbn13}:`, { error: err })
    }
    attempt++
  }
  return null
}

export async function findBookshopIsbn13ForBook(
  book: BookshopIsbn13LookupInput,
  maxAttempts = 10
): Promise<string | null> {
  // 1. If no isbn13 but has isbn, try 978+isbn
  if (!book.isbn13 && book.isbn) {
    const candidateIsbn13 = `978${book.isbn}`
    const status = await fetchBookshopIsbn13WithRetry(
      candidateIsbn13,
      maxAttempts
    )
    logger.log(`Bookshop.org status for ${book.title} (978+isbn): ${status}`)
    if (status === 200) return candidateIsbn13
  }
  // 2. If still not found, try Google Books
  const tryGoogle = async () => {
    let attempt = 0
    while (attempt < maxAttempts) {
      const isbn13 = await findBookshopIsbn13GoogleBooks(
        book.title,
        book.author
      )
      if (isbn13) {
        const url = `https://bookshop.org/book/${isbn13}`
        try {
          const res = await fetch(url, { method: 'HEAD' })
          if (res.status === 200) return isbn13
          if (res.status === 404) return null
          if (res.status === 429) {
            logger.log(
              `Bookshop.org rate limit hit for ${book.title} (GoogleBooks). Waiting 1 second...`
            )
            await wait.for({ seconds: 1 })
          } else {
            logger.log(
              `Bookshop.org unexpected status ${res.status} for ${book.title} (GoogleBooks). Retrying...`
            )
          }
        } catch (err) {
          logger.error(
            `Error fetching Bookshop.org for ${book.title} (GoogleBooks):`,
            { error: err }
          )
        }
      } else {
        // If GoogleBooks didn't return an ISBN, break early
        break
      }
      attempt++
    }
    return null
  }
  // 3. If still not found, try Brave
  const tryBrave = async () => {
    let attempt = 0
    while (attempt < maxAttempts) {
      const isbn13 = await findBookshopIsbn13Brave(book.title, book.author)
      if (isbn13) {
        const url = `https://bookshop.org/book/${isbn13}`
        try {
          const res = await fetch(url, { method: 'HEAD' })
          if (res.status === 200) return isbn13
          if (res.status === 404) return null
          if (res.status === 429) {
            logger.log(
              `Bookshop.org rate limit hit for ${book.title} (Brave). Waiting 1 second...`
            )
            await wait.for({ seconds: 1 })
          } else {
            logger.log(
              `Bookshop.org unexpected status ${res.status} for ${book.title} (Brave). Retrying...`
            )
          }
        } catch (err) {
          logger.error(
            `Error fetching Bookshop.org for ${book.title} (Brave):`,
            { error: err }
          )
        }
      } else {
        // If Brave didn't return an ISBN, break early
        break
      }
      attempt++
    }
    return null
  }
  // 4. If the book already has an isbn13, check bookshop.org
  if (book.isbn13) {
    const status = await fetchBookshopIsbn13WithRetry(book.isbn13, maxAttempts)
    logger.log(
      `Bookshop.org status for ${book.title} (${book.isbn13}): ${status}`
    )
    if (status === 200) return book.isbn13
    if (status === 404) {
      // Try Google Books, then Brave
      const googleResult = await tryGoogle()
      if (googleResult) return googleResult
      const braveResult = await tryBrave()
      if (braveResult) return braveResult
    }
    return null
  }
  // If no isbn13, try Google Books, then Brave
  const googleResult = await tryGoogle()
  if (googleResult) return googleResult
  const braveResult = await tryBrave()
  if (braveResult) return braveResult
  return null
}
