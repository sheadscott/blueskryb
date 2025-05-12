import { getBookshopSearchUrl } from '@/lib/db/bookshop-normalize'
import { book } from '@/lib/db/schema'
import * as cheerio from 'cheerio'
import { drizzle } from 'drizzle-orm/node-postgres'
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function GET() {
  const db = drizzle(process.env.POSTGRES_URL!)
  const books = await db
    .select({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn13: book.isbn13,
    })
    .from(book)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  )

  const results = []
  for (const b of books) {
    if (!b.title || !b.author) continue
    try {
      const url = getBookshopSearchUrl(b.title, b.author)
      await page.goto(url, { waitUntil: 'networkidle2' })
      await page.waitForSelector('#search-hits-container', { timeout: 10000 })
      const html = await page.content()

      const $ = cheerio.load(html)
      const firstLink = $('#search-hits-container a[href*="ean="]').first()
      const href = firstLink.attr('href')
      const match = href ? href.match(/[?&]ean=([0-9Xx]+)/) : null
      const ean = match ? match[1] : null

      results.push({
        id: b.id,
        title: b.title,
        author: b.author,
        isbn13: b.isbn13,
        bookshopEAN: ean,
      })
    } catch (err) {
      results.push({
        id: b.id,
        title: b.title,
        author: b.author,
        isbn13: b.isbn13,
        error: String(err),
      })
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  await browser.close()
  return NextResponse.json({ results })
}
