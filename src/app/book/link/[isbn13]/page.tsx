import PostHogClient from '@/lib/posthog-client'
import { getBaseUrl } from '@/lib/utils'
import { decode } from 'html-entities'
import type { Metadata } from 'next'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ isbn13: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { isbn13 } = await params

  try {
    const goodreadsApiUrl = `https://www.goodreads.com/book/auto_complete?q=${isbn13}&format=json`
    const goodreadsResponse = await fetch(goodreadsApiUrl)
    const goodreadsData = await goodreadsResponse.json()

    // Check if we have valid data
    if (
      !goodreadsData ||
      !Array.isArray(goodreadsData) ||
      goodreadsData.length === 0
    ) {
      console.error('No book data found for ISBN:', isbn13)
      return getDefaultMetadata()
    }

    const bookData = goodreadsData[0]
    const { bookTitleBare, description: desc } = bookData

    if (!bookTitleBare) {
      console.error('No book title found for ISBN:', isbn13)
      return getDefaultMetadata()
    }

    const baseUrl: string = getBaseUrl(process.env.VERCEL_TARGET_ENV as string)
    const title = `${bookTitleBare}`

    // Safely handle description
    let description = 'A book available on Bookshop.org'
    if (desc && desc.html) {
      description = desc.html.replace(/<[^>]*>?/g, '').slice(0, 200)
      description = decode(description)
    }

    const ogImageUrl = `${baseUrl}/api/og?isbn=${isbn13}`

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      openGraph: {
        title,
        description,
        url: 'https://blueskryb.cloud',
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
  } catch (error) {
    console.error('Error generating metadata for ISBN:', isbn13, error)
    return getDefaultMetadata()
  }
}

function getDefaultMetadata(): Metadata {
  const baseUrl: string = getBaseUrl(process.env.VERCEL_TARGET_ENV as string)
  const title = 'Book Information'
  const description = 'Book information and purchase link'

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: baseUrl,
      type: 'website',
      siteName: 'Blueskryb',
    },
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { isbn13 } = await params
  const { test } = await searchParams
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''

  // Check if it's a bot (social media crawlers, not regular browsers)
  const isBot =
    /facebookexternalhit|twitterbot|linkedinbot|pinterestbot|whatsappbot|slackbot|discordbot|mastodonbot|bsky|telegrambot|applebot|redditbot|skypeuripreview|microsoftpreview|googlebot|bingbot|yandexbot|duckduckbot|baiduspider|sogou|360spider|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|bytespider|gptbot|chatgpt|claudebot|anthropicbot|perplexitybot|youbot|cohere|geminibot|bardbot|snapchat|instagrambot|tumblrbot|viberbot|linebot|kakaobot|wechatbot|naver|daumoa|yeti|ia_archiver|archive\.org|wayback|crawler|spider|bot|scraper/i.test(
      userAgent
    )

  const isTest = test === 'true'

  // Debug logging
  console.log('User Agent:', userAgent)
  console.log('Is Bot:', isBot)
  console.log('Is Test:', isTest)

  // If it's not a bot and not in test mode, redirect to affiliate link
  if (!isBot && !isTest) {
    // Access PostHog distinct ID from cookie
    const cookiesStore = await cookies()

    // PostHog cookie format: ph_<project_api_key>_posthog
    const postHogCookieName = `ph_${process.env.NEXT_PUBLIC_POSTHOG_KEY}_posthog`
    const postHogCookie = cookiesStore.get(postHogCookieName)

    let distinctId = null
    if (postHogCookie?.value) {
      try {
        const cookieData = JSON.parse(postHogCookie.value)
        distinctId = cookieData.distinct_id
        console.log('PostHog Distinct ID:', distinctId)
      } catch (error) {
        console.error('Error parsing PostHog cookie:', error)
      }
    } else {
      console.log('PostHog cookie not found')
    }

    // You can now use distinctId for server-side analytics
    // For example, server-side event capture would require posthog-node:
    try {
      const posthog = PostHogClient()
      console.log('PostHog client created successfully')

      const eventData = {
        distinctId: distinctId || `${isbn13}-${Date.now()}`,
        event: 'Bookshop Redirect',
        properties: {
          $current_url: `${getBaseUrl(process.env.VERCEL_TARGET_ENV as string)}/book/link/${isbn13}`,
        },
      }

      console.log('Capturing server-side event:', eventData)
      posthog.capture(eventData)
      console.log('Server-side event captured, shutting down...')
      await posthog.shutdown()
      console.log('PostHog shutdown complete')
    } catch (error) {
      console.error('Error with server-side PostHog:', error)
    }

    console.log('Redirecting to:', `https://bookshop.org/a/113619/${isbn13}`)
    redirect(`https://bookshop.org/a/113619/${isbn13}`)
  }

  // If it's a bot or test mode, serve the page with metadata
  return (
    <div>
      <h1>Book Information</h1>
      <p>This page provides book metadata for social media previews.</p>
      <p>ISBN: {isbn13}</p>
      {isTest && <p>Test mode enabled</p>}
    </div>
  )
}

// https://blueskryb-git-dev-shea-scotts-projects.vercel.app/book/link/9780316595643

// 9781635575804
// https://blueskryb-git-dev-shea-scotts-projects.vercel.app/book/link/9781635575804

// 9781250391230
// https://blueskryb-git-dev-shea-scotts-projects.vercel.app/book/link/9781250391230

// 9780060976255
// https://blueskryb-git-dev-shea-scotts-projects.vercel.app/book/link/9780060976255
