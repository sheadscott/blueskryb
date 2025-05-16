import { db } from '@/lib/db/db'
import {
  book as bookTable,
  userBook as userBookTable,
  user as userTable,
} from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getUserWithBooks(handle: string) {
  // Find the user by handle
  console.log('handle', handle)
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.handle, handle))
    .limit(1)
  // console log user not found and return null
  console.log('db user', user)
  if (!user) return null

  // Find all books for this user (assuming a userBook join table)
  const userBooks = await db
    .select({ title: bookTable.title, author: bookTable.author })
    .from(userBookTable)
    .innerJoin(bookTable, eq(userBookTable.bookId, bookTable.id))
    .where(eq(userBookTable.userId, user.id))

  return { user, books: userBooks }
}
