import { eq } from 'drizzle-orm'
import { db } from '../db'
import { user as userTable } from '../schema'
import fetchDid from './fetch-did'

export default async function checkHandle(handle: string) {
  // Fetch the did for the handle
  const didResult = await fetchDid(handle)
  if (!didResult) return null
  const did = didResult.did

  // Query the db for a user with this did
  const usersWithDid = await db
    .select()
    .from(userTable)
    .where(eq(userTable.did, did))
    .limit(1)
  const userWithDid = usersWithDid[0]

  if (userWithDid) {
    if (userWithDid.handle !== handle) {
      // Update the user's handle to the new one
      await db
        .update(userTable)
        .set({ handle })
        .where(eq(userTable.id, userWithDid.id))
      // Return the updated user
      return { ...userWithDid, handle }
    }
    // Return the user as is
    return userWithDid
  }

  // No user with this did exists
  return null
}
