import { db } from '@/lib/db/db'
import { user as userTable } from '@/lib/db/schema'
import * as AppBskyActorDefs from '@atproto/api/src/client/types/app/bsky/actor/defs'
import { eq } from 'drizzle-orm'

// User type
export type User = {
  id: number
  did: string
  handle: string
  name: string
  avatar: string | null
}

export async function findOrCreateUser(
  data: AppBskyActorDefs.ProfileViewDetailed
): Promise<User> {
  // Check if user exists
  const existing = await db
    .select()
    .from(userTable)
    .where(eq(userTable.did, data.did))
    .limit(1)
  if (existing.length > 0) {
    // Map DB row to User type
    return {
      id: existing[0].id,
      did: existing[0].did,
      handle: data.handle, // fallback to current handle
      name: existing[0].name ?? data.displayName ?? data.handle,
      avatar: data.avatar || null,
    }
  }

  // Insert new user
  const [created] = await db
    .insert(userTable)
    .values({
      did: data.did,
      name: data.displayName || data.handle,
      email: undefined, // Bluesky does not provide email
    })
    .returning()
  return {
    id: created.id,
    did: created.did,
    handle: data.handle,
    name: created.name ?? data.displayName ?? data.handle,
    avatar: data.avatar || null,
  }
}
