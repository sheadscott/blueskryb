/* eslint-disable @next/next/no-img-element */
import { isbn13Regex, retryFetch } from '@/lib/utils'
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

  // https://www.goodreads.com/book/auto_complete?q=9780307951335&format=json

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
  const { imageUrl, title, bookTitleBare, bookId, author } = bookData

  if (!imageUrl || (!title && !bookTitleBare) || !author) {
    return new Response('Incomplete book data', { status: 404 })
  }

  // const imageRegex = /\._.*_/
  // const coverUrl = imageUrl.replace(imageRegex, '')
  const coverUrl =
    'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1503141060i/33155325._SX75_.jpg'

  console.log('coverUrl', coverUrl)

  // fetch the cover image for testing
  const coverImageResponse = await fetch(coverUrl)
  console.log('coverImageResponse', coverImageResponse.status)
  // Pre-fetch the cover image with retry logic (except for 404s)

  try {
    await retryFetch(coverUrl)
    // const response = await retryFetch(coverUrl)
    // console.log('RESPONSE', response)
  } catch (error) {
    const errorMessage = (error as Error).message
    console.error('Cover image fetch failed:', errorMessage)

    if (errorMessage.includes('404')) {
      return new Response('Cover image not found', { status: 404 })
    }

    return new Response('Cover image not accessible after retries', {
      status: 404,
    })
  }

  // POST /api/books/create
  // Create a book in the database (optional - don't fail if this errors)
  // try {
  //   const env = process.env.VERCEL_TARGET_ENV || 'development'
  //   await fetch(`${getBaseUrl(env)}/api/books/create`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       title: title || bookTitleBare,
  //       author: author.name,
  //       isbn13: isbn,
  //       coverImageUrl: coverUrl,
  //       grBookId: bookId,
  //     }),
  //   })

  //   // const result = await response.json()
  //   // console.log('Book creation result:', result)
  // } catch (error) {
  //   console.error(
  //     'Book creation failed (continuing with OG generation):',
  //     error
  //   )
  //   // Continue with OG image generation even if book creation fails
  // }

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
            {bookTitleBare || title}
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
