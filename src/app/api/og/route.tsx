/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'
// export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  if (!url) {
    return new Response('Missing url param', { status: 400 })
  }
  if (!url.startsWith('https://bookshop.org/')) {
    return new Response('Invalid url', { status: 400 })
  }

  console.log('url', url)
  // Example Bookshop.org url:
  // https://bookshop.org/p/books/a-court-of-thorns-and-roses-sarah-j-maas/7173214?ean=9781635575569&next=t

  // Get the isbn13 (ean) from the url
  const match = url.match(/97\d{11}/)
  const isbn13 = match?.[0]
  if (!isbn13) {
    return new Response('Invalid url. No ISBN13 found.', { status: 400 })
  }

  console.log('isbn13', isbn13)

  const goodreadsApiUrl = `https://www.goodreads.com/book/auto_complete?q=${isbn13}&format=json`
  const goodreadsResponse = await fetch(goodreadsApiUrl)
  const goodreadsData = await goodreadsResponse.json()
  console.log('goodreadsData', goodreadsData)

  const { imageUrl, bookTitleBare, author, description } = goodreadsData[0]
  const coverUrl = imageUrl.replace(/\._[A-Z][A-Z]\d+_/, '')
  // No longer than 200 characters
  const descriptionHtml = description.html
    .replace(/<[^>]*>?/g, '')
    .slice(0, 200)
    .trim()

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 628,
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 64,
          background: '#f7f7f7',
          paddingTop: 32,
          paddingBottom: 32,
          paddingLeft: 36,
          paddingRight: 36,
        }}
      >
        <img
          alt="cover image"
          src={coverUrl}
          style={{
            maxHeight: 628 - 64,
            maxWidth: 376,
            objectFit: 'cover',
            boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
            borderRadius: 16,
            background: '#fff',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>
            {bookTitleBare}
          </h1>
          <p style={{ fontSize: 24, fontWeight: 400, lineHeight: 1.2 }}>
            By {author.name}
          </p>
          <p
            style={{
              fontSize: 18,
              fontWeight: 500,
              lineHeight: 1.2,
              maxWidth: 600,
              flexGrow: 1,
            }}
          >
            {descriptionHtml}
          </p>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}
          >
            <p style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.2 }}>
              Bookshop.org supports independent bookstores.
            </p>
            <img
              alt="Bookshop.org"
              src="https://cdn.prod.website-files.com/6267f35934aa8b1795cf1a9f/63e3d7713ec753b653c3136c_Button1-WF.png"
              style={{ height: 48, objectFit: 'contain' }}
            />
          </div>

          <p style={{ fontSize: 14, maxWidth: 600 }}>
            Disclosure: This link is a product of Blueskryb.cloud, an affiliate
            of Bookshop.org and will earn a commission if you click through and
            make a purchase.
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 628 }
  )
}
