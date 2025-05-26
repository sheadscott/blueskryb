import { user } from '@/lib/db/schema'
import { inArray } from 'drizzle-orm'
import { db } from '../db'

interface User {
  did: string
}

export async function getUsersByDid(dids: string[]): Promise<User[]> {
  if (dids.length === 0) {
    return []
  }
  return await db
    .select({
      did: user.did,
    })
    .from(user)
    .where(inArray(user.did, dids))
}
