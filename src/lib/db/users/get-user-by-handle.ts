import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '../db'

export async function getUserByHandle(handle: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.handle, handle))
    .limit(1)
  if (result[0]) {
    throw new Error('A user with that handle already exists.')
  }
  return null
}
