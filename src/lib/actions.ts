'use server'

import createBlueskyClient from '@/lib/atproto'
import getSession from '@/lib/iron'

export async function signInWithBluesky(handle: string): Promise<string> {
  // Create a Bluesky client
  const blueskyClient = await createBlueskyClient()

  try {
    // Get the URL to authorize the user
    const url: URL = await blueskyClient.authorize(handle)

    // Return the URL
    return url.toString()
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes('Failed to resolve identity')
    ) {
      // Throw a custom error message for the client to handle
      throw new Error('Failed to resolve identity')
    }
    // Optionally, log or handle other errors
    throw err
  }
}

export async function signOut(): Promise<void> {
  // Get the session
  const session = await getSession()

  // Destroy the session
  session.destroy()
}
