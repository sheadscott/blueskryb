'use server'

import createBlueskyClient from '@/lib/atproto'
import checkHandle from '@/lib/db/users/check-handle'
import { createUser } from '@/lib/db/users/create-user'
import fetchDid from '@/lib/db/users/fetch-did'
import { getUserByEmail } from '@/lib/db/users/get-user-by-email'
import { getUserByHandle } from '@/lib/db/users/get-user-by-handle'
import getSession from '@/lib/iron'

export async function signUp(
  email: string,
  handle: string
): Promise<{ url?: string; error?: string }> {
  try {
    await getUserByEmail(email)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Email exists' }
  }

  try {
    await getUserByHandle(handle)
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Handle exists' }
  }

  let did
  try {
    const didResult = await fetchDid(handle)
    did = didResult.did
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : 'Bluesky handle does not exist',
    }
  }

  let user
  try {
    user = await createUser(email, handle, did)
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Failed to create user.',
    }
  }

  try {
    const result = await signInWithBluesky(user.handle)
    if (result.error) return { error: result.error }
    if (result.url) return { url: result.url }
    return { error: 'Unknown error during sign in.' }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to sign in.' }
  }
}

export async function signInWithBluesky(
  handle: string
): Promise<{ url?: string; error?: string }> {
  const user = await checkHandle(handle)
  if (!user) {
    return { error: 'No user found with that handle.' }
  }

  const blueskyClient = await createBlueskyClient()

  try {
    const url: URL = await blueskyClient.authorize(handle)
    return { url: url.toString() }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to sign in.' }
  }
}

export async function signOut(): Promise<void> {
  const session = await getSession()
  session.destroy()
}
