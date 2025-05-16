import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '../db'

export async function getUserByHandle(handle: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.handle, handle))
    .limit(1)
  return result[0] ?? null
}
