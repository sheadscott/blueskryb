/* eslint-disable @next/next/no-img-element */
import { isbn13Regex } from '@/lib/utils'
import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isbn = searchParams.get('isbn')
  if (!isbn) {
    return new Response('Missing isbn param', { status: 400 })
  }
  if (!isbn13Regex.test(isbn)) {
    return new Response('Invalid isbn', { status: 400 })
  }

  // Load fonts from the public folder using fetch
  const [robotoSerifResponse, robotoRegularResponse] = await Promise.all([
    fetch(new URL('/fonts/RobotoSerif_36pt-Bold.ttf', request.url)),
    fetch(new URL('/fonts/Roboto-Regular.ttf', request.url)),
  ])

  let robotoSerifFont = null
  let robotoRegularFont = null

  if (!robotoSerifResponse.ok) {
    console.error('Roboto Serif font fetch failed:', robotoSerifResponse.status)
  } else {
    robotoSerifFont = await robotoSerifResponse.arrayBuffer()
    console.log('Roboto Serif loaded, size:', robotoSerifFont.byteLength)
  }

  if (!robotoRegularResponse.ok) {
    console.error(
      'Roboto Regular font fetch failed:',
      robotoRegularResponse.status
    )
  } else {
    robotoRegularFont = await robotoRegularResponse.arrayBuffer()
    console.log('Roboto Regular loaded, size:', robotoRegularFont.byteLength)
  }

  const goodreadsApiUrl = `https://www.goodreads.com/book/auto_complete?q=${isbn}&format=json`
  const goodreadsResponse = await fetch(goodreadsApiUrl)
  const goodreadsData = await goodreadsResponse.json()
  // console.log('goodreadsData', goodreadsData)

  if (
    !goodreadsData ||
    !Array.isArray(goodreadsData) ||
    goodreadsData.length === 0
  ) {
    return new Response('No book data found', { status: 404 })
  }

  const bookData = goodreadsData[0]
  const { imageUrl, bookTitleBare, author } = bookData

  if (!imageUrl || !bookTitleBare || !author) {
    return new Response('Incomplete book data', { status: 404 })
  }

  const coverUrl = imageUrl.replace(/\._[A-Z][A-Z]\d+_/, '')

  // Pre-fetch the cover image with retry logic (except for 404s)
  const maxRetries = 3
  let coverResponse

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      coverResponse = await fetch(coverUrl)
      if (coverResponse.ok) {
        console.log('Cover image validated:', coverUrl)
        break
      }

      if (coverResponse.status === 404) {
        console.error('Cover image not found (404):', coverUrl)
        return new Response('Cover image not found', { status: 404 })
      }

      console.warn(
        `Cover image fetch failed (attempt ${attempt}/${maxRetries}):`,
        coverResponse.status,
        coverUrl
      )

      if (attempt === maxRetries) {
        console.error(
          'Cover image fetch failed after all retries:',
          coverResponse.status,
          coverUrl
        )
        return new Response('Cover image not accessible after retries', {
          status: 404,
        })
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
      )
    } catch (error) {
      console.warn(
        `Cover image fetch error (attempt ${attempt}/${maxRetries}):`,
        error,
        coverUrl
      )

      if (attempt === maxRetries) {
        console.error(
          'Cover image fetch error after all retries:',
          error,
          coverUrl
        )
        return new Response('Cover image fetch error after retries', {
          status: 404,
        })
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
      )
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 628,
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 48,
          background: '#FFFFFF',
        }}
      >
        <img
          alt="cover image"
          src={coverUrl}
          style={{
            // borderRadius: 6,
            height: 628 - 56,
            width: (628 - 56) * 0.667,
            margin: 28,
            marginRight: 0,
            padding: 0,
            objectFit: 'cover',
            boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
            background: '#fff',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            maxWidth: 700,
            paddingTop: 14,
            paddingBottom: 14,
          }}
        >
          <h1
            style={{
              fontSize: 42,
              fontWeight: 700,
              lineHeight: 1.2,
              fontFamily: 'Roboto Serif',
            }}
          >
            {bookTitleBare}
          </h1>
          <p
            style={{
              fontSize: 36,
              fontWeight: 400,
              lineHeight: 1.2,
              flexGrow: 1,
              fontFamily: 'Roboto Serif',
            }}
          >
            By {author.name}
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <p
              style={{
                fontSize: 24,
                fontWeight: 400,
                lineHeight: 1.2,
                fontFamily: 'Roboto',
              }}
            >
              Bookshop.org supports independent bookstores.
            </p>
            <img
              alt="Bookshop.org"
              src="https://cdn.prod.website-files.com/6267f35934aa8b1795cf1a9f/63e3d7713ec753b653c3136c_Button1-WF.png"
              style={{ height: 80, objectFit: 'contain' }}
            />
          </div>

          <p style={{ fontSize: 24, fontFamily: 'Roboto', paddingRight: 36 }}>
            Disclosure: This link is provided by Blueskryb.cloud, an affiliate
            of Bookshop.org and will earn a commission if you click through and
            make a purchase.
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 628,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      fonts: [
        ...(robotoSerifFont
          ? [
              {
                name: 'Roboto Serif',
                data: robotoSerifFont,
                style: 'normal' as const,
              },
            ]
          : []),
        ...(robotoRegularFont
          ? [
              {
                name: 'Roboto',
                data: robotoRegularFont,
                style: 'normal' as const,
              },
            ]
          : []),
      ],
    }
  )
}
