import { logger } from '@trigger.dev/sdk/v3'

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
