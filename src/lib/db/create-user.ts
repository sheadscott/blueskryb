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
  // Check if user exists by handle
  const existing = await db
    .select()
    .from(userTable)
    .where(eq(userTable.handle, data.handle))
    .limit(1)

  const newName = data.displayName || data.handle
  const newHandle = data.handle
  const newDid = data.did

  if (existing.length > 0) {
    const user = existing[0]
    // If user has a did, treat as returning user
    if (user.did) {
      if (user.name !== newName) {
        await db
          .update(userTable)
          .set({ name: newName })
          .where(eq(userTable.id, user.id))
      }
      return {
        id: user.id,
        did: user.did ?? '',
        handle: user.handle,
        name: newName ?? '',
        avatar: data.avatar ?? null,
      }
    } else {
      // User has handle but no did, update did and name
      await db
        .update(userTable)
        .set({ did: newDid, name: newName })
        .where(eq(userTable.id, user.id))
      return {
        id: user.id,
        did: newDid ?? '',
        handle: user.handle,
        name: newName ?? '',
        avatar: data.avatar ?? null,
      }
    }
  }

  // Insert new user
  const [created] = await db
    .insert(userTable)
    .values({
      did: newDid,
      name: newName,
      handle: newHandle,
      email: '', // required by schema, set to empty string or provide real value
    })
    .returning()
  return {
    id: created.id,
    did: created.did ?? '',
    handle: created.handle,
    name: created.name ?? '',
    avatar: data.avatar ?? null,
  }
}
