'use server'

import createBlueskyClient from '@/lib/atproto'
import getSession from '@/lib/iron'

export async function signInWithBluesky(handle: string): Promise<string> {
  // Create a Bluesky client
  const blueskyClient = await createBlueskyClient()

  // Get the URL to authorize the user
  const url: URL = await blueskyClient.authorize(handle)

  // Return the URL
  return url.toString()
}

export async function signOut(): Promise<void> {
  // Get the session
  const session = await getSession()

  // Destroy the session
  session.destroy()
}
