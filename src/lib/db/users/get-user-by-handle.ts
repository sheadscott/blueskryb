import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '../db'

export async function getUserByHandle(handle: string, context: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.handle, handle))
    .limit(1)
  if (result[0] && context === 'signUp') {
    throw new Error('A user with that handle already exists.')
  }
  if (!result[0] && context === 'signIn') {
    throw new Error('No user with that handle exists.')
  }
  return null
}
