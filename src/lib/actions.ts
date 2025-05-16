'use server'

import createBlueskyClient from '@/lib/atproto'
import { createUser } from '@/lib/db/users/create-user'
import { fetchDid } from '@/lib/db/users/fetch-did'
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
    return { error: err instanceof Error ? err.message : 'Email error' }
  }

  try {
    const existingHandle = await getUserByHandle(handle)
    if (existingHandle)
      return { error: 'A user with that handle already exists.' }
  } catch {
    return { error: 'Handle error' }
  }

  let did
  try {
    const didResult = await fetchDid(handle)
    did = didResult.did
  } catch {
    return { error: 'Could not resolve Bluesky handle.' }
  }

  let user
  try {
    user = await createUser(email, handle, did)
  } catch {
    return { error: 'Failed to create user.' }
  }

  try {
    const url: string = await signInWithBluesky(user.handle)
    return { url }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to sign in.' }
  }
}

export async function signInWithBluesky(handle: string): Promise<string> {
  try {
    const user = await getUserByHandle(handle)
    if (!user) {
      throw new Error(
        'No user found with that handle. Please check your spelling or sign up.'
      )
    }
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err))
  }

  const blueskyClient = await createBlueskyClient()

  try {
    const url: URL = await blueskyClient.authorize(handle)
    return url.toString()
  } catch (err) {
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
  const session = await getSession()
  session.destroy()
}
