import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '../db'

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1)
  return result[0] ?? null
}
