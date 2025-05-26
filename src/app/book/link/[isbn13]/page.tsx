import type { Metadata } from 'next'

type Props = {
  params: Promise<{ isbn13: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { isbn13 } = await params

  const goodreadsApiUrl = `https://www.goodreads.com/book/auto_complete?q=${isbn13}&format=json`
  const goodreadsResponse = await fetch(goodreadsApiUrl)
  const goodreadsData = await goodreadsResponse.json()
  console.log('goodreadsData', goodreadsData)

  const { bookTitleBare, author, description: desc } = goodreadsData[0]

  const baseUrl = 'https://blueskryb.cloud'
  const title = `${bookTitleBare} by ${author.name}`
  const description = desc.html.replace(/<[^>]*>?/g, '').slice(0, 200)

  const ogImageUrl = `http://localhost:3000/api/og?isbn=${isbn13}`
  // fetch data

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    themeColor: 'black',
    openGraph: {
      title,
      description,
      url: baseUrl,
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Preview image for ${title}`,
        },
      ],
      type: 'website',
      siteName: 'Blueskryb',
    },
  }
}

export default async function Page({ params }: Props) {
  const { isbn13 } = await params
  return <div>Book details here {isbn13}</div>
}

// export async function GET(request: Request) {
//   const userAgent = request.headers.get('user-agent') || ''
//   const isBot =
//     /apple.*|facebook.*|linkedin.*|twitter.*|pinterest.*|whatsapp.*|slack.*|discord.*|mastodon.*|b(lue)?sky.*/i.test(
//       userAgent
//     )

//   if (isBot) {
//     // Serve OG image or metadata
//   } else {
//     // Serve normal page or redirect
//   }
// }
