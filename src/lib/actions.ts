'use server'

import createBlueskyClient from '@/lib/atproto'
import { createUser } from '@/lib/db/users/create-user'
import { getUserByEmail } from '@/lib/db/users/get-user-by-email'
import { getUserByHandle } from '@/lib/db/users/get-user-by-handle'
import getSession from '@/lib/iron'

export async function signUp(email: string, handle: string): Promise<string> {
  console.time('signUp_total')
  console.time('getUserByEmail')
  const existingEmail = await getUserByEmail(email)
  console.timeEnd('getUserByEmail')
  if (existingEmail) throw new Error('A user with that email already exists.')

  console.time('getUserByHandle')
  const existingHandle = await getUserByHandle(handle)
  console.timeEnd('getUserByHandle')
  if (existingHandle) throw new Error('A user with that handle already exists.')

  // Check with Bluesky to see if the user exists
  console.time('bluesky_handle_check_fetch')
  const response = await fetch(
    `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`
  )
  console.timeEnd('bluesky_handle_check_fetch')
  if (response.status !== 200) {
    throw new Error(
      'A Bluesky user with that handle does not exist. You must have a Bluesky account to use Blueskryb.'
    )
  }

  console.time('createUser')
  const user = await createUser(email, handle)
  console.timeEnd('createUser')

  console.log('New User Created: ', user)
  // Login the user
  try {
    console.time('signInWithBluesky_in_signUp')
    const url: string = await signInWithBluesky(user.handle)
    console.timeEnd('signInWithBluesky_in_signUp')
    console.log('Redirecting to: ', url)
    console.timeEnd('signUp_total')
    return url
  } catch (err) {
    console.timeEnd('signUp_total')
    throw new Error(err instanceof Error ? err.message : String(err))
  }
}

export async function signInWithBluesky(handle: string): Promise<string> {
  console.time('signInWithBluesky_total')
  try {
    console.time('getUserByHandle_in_signIn')
    const user = await getUserByHandle(handle)
    console.timeEnd('getUserByHandle_in_signIn')
    if (!user) {
      throw new Error(
        'No user found with that handle. Please check your spelling or sign up.'
      )
    }
  } catch (err) {
    console.timeEnd('signInWithBluesky_total')
    throw new Error(err instanceof Error ? err.message : String(err))
  }

  console.time('createBlueskyClient')
  const blueskyClient = await createBlueskyClient()
  console.timeEnd('createBlueskyClient')

  try {
    console.time('authorize')
    const url: URL = await blueskyClient.authorize(handle)
    console.timeEnd('authorize')
    console.timeEnd('signInWithBluesky_total')
    return url.toString()
  } catch (err) {
    console.timeEnd('signInWithBluesky_total')
    if (
      err instanceof Error &&
      err.message.includes('Failed to resolve identity')
    ) {
      throw new Error('Failed to resolve identity')
    }
    throw err
  }
}

export async function signOut(): Promise<void> {
  // Get the session
  const session = await getSession()

  // Destroy the session
  session.destroy()
}
