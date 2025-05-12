import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import puppeteer from 'puppeteer'
import { getBookshopSearchUrl } from './bookshop-normalize'
import { book } from './schema'

/**
 * Fetches the Bookshop.org beta search HTML for a given title and author.
 * @param title - The book title
 * @param author - The book author
 * @returns The HTML string of the search results page
 */
export async function getBookshopSearchHtml(
  title: string,
  author: string
): Promise<string> {
  const url = getBookshopSearchUrl(title, author)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  )
  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.waitForSelector('#search-hits-container', { timeout: 10000 })
  const html = await page.content()
  await browser.close()
  return html
}

/**
 * Fetches the first EAN (ISBN13) from Bookshop.org search results for a given title and author.
 * @returns The first EAN string, or null if not found.
 */
export async function getFirstBookshopEan(
  title: string,
  author: string
): Promise<string | null> {
  const html = await getBookshopSearchHtml(title, author)
  const cheerio = await import('cheerio')
  const $ = cheerio.load(html)
  const firstLink = $('#search-hits-container a[href*="ean="]').first()
  if (!firstLink.length) return null
  const href = firstLink.attr('href')
  if (!href) return null
  const match = href.match(/[?&]ean=([0-9Xx]+)/)
  return match ? match[1] : null
}

// Fetch title and author from the book table by ISBN13
export async function getBookTitleAuthorByIsbn13(isbn13: string) {
  const db = drizzle(process.env.POSTGRES_URL!)
  const result = await db
    .select({ title: book.title, author: book.author })
    .from(book)
    .where(eq(book.isbn13, isbn13))
  return result[0] || null
}

// Use Puppeteer to fetch the first EAN (ISBN13) from Bookshop.org search results for a book in the db by ISBN13
export async function getFirstBookshopEanByIsbn13(
  isbn13: string
): Promise<string | null> {
  const bookData = await getBookTitleAuthorByIsbn13(isbn13)
  if (!bookData) return null
  const html = await getBookshopSearchHtml(bookData.title, bookData.author)
  // Use cheerio to parse the HTML
  const cheerio = await import('cheerio')
  const $ = cheerio.load(html)
  const firstLink = $('#search-hits-container a[href*="ean="]').first()
  if (!firstLink.length) return null
  const href = firstLink.attr('href')
  if (!href) return null
  const match = href.match(/[?&]ean=([0-9Xx]+)/)
  return match ? match[1] : null
}
