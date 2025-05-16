import { user } from '@/lib/db/schema'
import { db } from '../db'

export async function createUser(email: string, handle: string, did: string) {
  const [created] = await db
    .insert(user)
    .values({ email, handle, name: null, did })
    .returning()
  return created
}
