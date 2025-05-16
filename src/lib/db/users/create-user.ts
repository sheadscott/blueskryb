import { user } from '@/lib/db/schema'
import { db } from '../db'

export async function createUser(email: string, handle: string, did: string) {
  const [created] = await db
    .insert(user)
    .values({ email, handle, name: null, did })
    .returning()
  if (!created) {
    throw new Error('Failed to create user.')
  }
  return created
}
