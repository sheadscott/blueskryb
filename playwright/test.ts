import { writeFileSync } from 'fs'
import { chromium } from 'playwright'

async function fetchBookshopPage(url: string) {
  const browser = await chromium.launch({ headless: false }) // See the browser
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(5000) // Wait 2 seconds
  await page.waitForSelector('#search-hits-container', {
    timeout: 20000,
    state: 'visible',
  })
  await page.screenshot({ path: 'playwright/debug.png' })
  const html = await page.content()
  writeFileSync('playwright/debug.html', html)
  await browser.close()
  return html
}

fetchBookshopPage(
  'https://bookshop.org/beta-search?keywords=moby+dick+by+herman+melville'
)
  .then((html) => console.log(html))
  .catch((err) => console.error(err))

// https://bookshop.org/a/YOURAFFILIATEID#/ISBN13

// https://bookshop.org/a/113619/9781563895579
