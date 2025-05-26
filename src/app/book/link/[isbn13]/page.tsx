import { getBaseUrl } from '@/lib/utils'
import { decode } from 'html-entities'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ isbn13: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { isbn13 } = await params

  const goodreadsApiUrl = `https://www.goodreads.com/book/auto_complete?q=${isbn13}&format=json`
  const goodreadsResponse = await fetch(goodreadsApiUrl)
  const goodreadsData = await goodreadsResponse.json()
  // console.log('goodreadsData', goodreadsData)

  const { bookTitleBare, author, description: desc } = goodreadsData[0]

  const baseUrl: string = getBaseUrl(process.env.VERCEL_TARGET_ENV as string)
  const title = `${bookTitleBare} by ${author.name}`
  let description = desc.html.replace(/<[^>]*>?/g, '').slice(0, 200)
  description = decode(description)

  const ogImageUrl = `${baseUrl}/api/og?isbn=${isbn13}`
  // fetch data

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
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
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''

  // Check if it's a bot (social media crawlers, not regular browsers)
  const isBot =
    /facebookexternalhit|twitterbot|linkedinbot|pinterestbot|whatsappbot|slackbot|discordbot|mastodonbot|bsky|telegrambot|applebot|redditbot|skypeuripreview|microsoftpreview|googlebot|bingbot|yandexbot|duckduckbot|baiduspider|sogou|360spider|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|bytespider|gptbot|chatgpt|claudebot|anthropicbot|perplexitybot|youbot|cohere|geminibot|bardbot|snapchat|instagrambot|tumblrbot|viberbot|linebot|kakaobot|wechatbot|naver|daumoa|yeti|ia_archiver|archive\.org|wayback|crawler|spider|bot|scraper/i.test(
      userAgent
    )

  // Debug logging
  console.log('User Agent:', userAgent)
  console.log('Is Bot:', isBot)

  // If it's not a bot, redirect to affiliate link
  if (!isBot) {
    console.log('Redirecting to:', `https://bookshop.org/a/113619/${isbn13}`)
    redirect(`https://bookshop.org/a/113619/${isbn13}`)
  }

  // If it's a bot, serve the page with metadata (they'll see the generateMetadata content)
  return (
    <div>
      <h1>Book Information</h1>
      <p>This page provides book metadata for social media previews.</p>
      <p>ISBN: {isbn13}</p>
    </div>
  )
}

// https://blueskryb-git-dev-shea-scotts-projects.vercel.app/book/link/9780316595643
