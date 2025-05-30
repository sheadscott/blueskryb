import { db } from '@/lib/db/db'
import { book as bookTable } from '@/lib/db/schema'

export interface CreateBookParams {
  isbn13?: string
  title: string
  author: string
  coverImageUrl?: string
  grBookId?: string
}

/**
 * Creates a new book in the database
 * @param params - Book creation parameters
 * @returns The created book record
 */
export async function createNewBook(params: CreateBookParams) {
  const { isbn13, title, author, coverImageUrl, grBookId } = params

  const [newBook] = await db
    .insert(bookTable)
    .values({
      title,
      author,
      isbn13,
      bookshopIsbn13: isbn13, // Set bookshopIsbn13 to the provided isbn13
      coverImageUrl,
      grBookId,
    })
    .returning()

  return newBook
}
