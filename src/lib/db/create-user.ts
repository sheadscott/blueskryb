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

  const newName = data.displayName || data.handle
  const newHandle = data.handle

  if (existing.length > 0) {
    const user = existing[0]
    // Check if any field is different
    if (user.name !== newName || user.handle !== newHandle) {
      // Update changed fields
      await db
        .update(userTable)
        .set({
          name: newName,
          handle: newHandle,
        })
        .where(eq(userTable.did, data.did))
    }
    return {
      id: user.id,
      did: user.did,
      handle: newHandle,
      name: newName,
      avatar: data.avatar ?? null,
    }
  }

  // Insert new user
  const [created] = await db
    .insert(userTable)
    .values({
      did: data.did,
      name: newName,
      email: undefined, // Bluesky does not provide email
      handle: newHandle,
    })
    .returning()
  return {
    id: created.id,
    did: created.did,
    handle: created.handle,
    name: created.name,
    avatar: data.avatar ?? null,
  }
}
