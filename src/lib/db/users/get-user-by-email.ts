import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '../db'

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1)
  if (result[0]) {
    throw new Error('A user with that email already exists.')
  }
  return null
}
