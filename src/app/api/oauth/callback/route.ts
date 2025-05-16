import createBlueskyClient from '@/lib/atproto'
import { findOrCreateUser } from '@/lib/db/create-user'
import getSession from '@/lib/iron'
import { getBaseUrl } from '@/lib/utils'
import { Agent } from '@atproto/api'
import { NextRequest, NextResponse } from 'next/server'

console.log(
  'process.env.NEXT_PUBLIC_VERCEL_URL',
  process.env.NEXT_PUBLIC_VERCEL_URL
)
console.log('process.env.VERCEL_TARGET_ENV', process.env.VERCEL_TARGET_ENV)

export async function GET(request: NextRequest) {
  // Get the next URL from the request
  const nextUrl = request.nextUrl
  // const isLocalhost = process.env.NEXT_PUBLIC_VERCEL_URL?.includes('127.0.0.1')
  // const url = isLocalhost
  //   ? process.env.NEXT_PUBLIC_VERCEL_URL
  //   : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  const baseUrl: string = getBaseUrl(process.env.VERCEL_TARGET_ENV as string)
  try {
    // Create a Bluesky client
    const blueskyClient = await createBlueskyClient()

    // Get the session and state from the callback
    const { session } = await blueskyClient.callback(nextUrl.searchParams)

    // Create an agent
    const agent = new Agent(session)

    // Get the profile of the user
    const { data } = await agent.getProfile({ actor: session.did })

    // Find or create user in the database
    const dbUser = await findOrCreateUser(data)
    const ironSession = await getSession()
    ironSession.user = dbUser
    await ironSession.save()

    // Redirect to the private page
    return NextResponse.redirect(`${baseUrl}`)
  } catch (e: unknown) {
    if (e instanceof Error) {
      // Bluesky error
      return NextResponse.redirect(`${baseUrl}/?error=${e.message}`)
    } else {
      // Unknown error
      return NextResponse.redirect(`${baseUrl}/?error=Unknown error`)
    }
  }
}
