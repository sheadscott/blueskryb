import {
  CleanedGoodreadsBook,
  cleanGoodreadsCsvRow,
  GoodreadsCsvRow,
} from '@/lib/csv/goodreads-cleanup'
import { book as bookTable, userBook as userBookTable } from '@/lib/db/schema'
import { logger, task, wait } from '@trigger.dev/sdk/v3'
import { eq, or } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import Papa from 'papaparse'

// Initialize Drizzle client
const db = drizzle(process.env.POSTGRES_URL!)

function dedupeBooks(books: CleanedGoodreadsBook[]): CleanedGoodreadsBook[] {
  const seen = new Set<string>()
  const deduped: CleanedGoodreadsBook[] = []
  for (const b of books) {
    const key = b.isbn13 || b.isbn || b.bookId
    if (!key) continue
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push(b)
    }
  }
  logger.log(`Deduped books count: ${deduped.length}`)
  return deduped
}

export const processGoodreadsCSV = task({
  id: 'process-goodreads-csv',
  maxDuration: 10,
  run: async (payload: { content: string; userId: number }) => {
    logger.log('Processing Goodreads CSV', { userId: payload.userId })
    const results: CleanedGoodreadsBook[] = []
    const parseResult = Papa.parse<GoodreadsCsvRow>(payload.content, {
      header: true,
      skipEmptyLines: true,
    })
    for (const data of parseResult.data) {
      const cleaned = cleanGoodreadsCsvRow(data)
      if (cleaned) results.push(cleaned)
      else logger.warn('Skipping row due to validation/parsing error', { data })
    }
    logger.log(
      `Parsed ${results.length} valid books from CSV for user ${payload.userId}`
    )

    // Deduplicate books by isbn13, then isbn, then grBookId
    const uniqueBooks = dedupeBooks(results)
    logger.log(`Unique books for insert: ${JSON.stringify(uniqueBooks)}`)

    const existingBooks = await db
      .select()
      .from(bookTable)
      .where(
        or(
          ...uniqueBooks
            .filter((b) => b.isbn13)
            .map((b) => eq(bookTable.isbn13, b.isbn13!)),
          ...uniqueBooks
            .filter((b) => b.isbn)
            .map((b) => eq(bookTable.isbn, b.isbn!)),
          ...uniqueBooks
            .filter((b) => b.bookId)
            .map((b) => eq(bookTable.grBookId, b.bookId))
        )
      )
    const existingKeys = new Set(
      existingBooks.flatMap((b) =>
        [b.isbn13, b.isbn, b.grBookId].filter(Boolean)
      )
    )
    // Prepare new books for batch insert
    const newBooks = uniqueBooks.filter(
      (b) =>
        !(b.isbn13 && existingKeys.has(b.isbn13)) &&
        !(b.isbn && existingKeys.has(b.isbn)) &&
        !(b.bookId && existingKeys.has(b.bookId))
    )
    logger.log(`Books to insert: ${JSON.stringify(newBooks)}`)

    // Before inserting, make a request to this url https://bookshop.org/book/`isbn13`
    // Get just the status code and log it.
    // Wait 2 seconds and repeat for each book.
    // If the book doesn't have an isbn13, skip it.
    for (const [i, b] of newBooks.entries()) {
      if (!b.isbn13) {
        logger.log(`Skipping book without isbn13: ${b.title}`)
        continue
      }
      const url = `https://bookshop.org/book/${b.isbn13}`
      try {
        const res = await fetch(url, { method: 'HEAD' })
        logger.log(
          `Bookshop.org status for ${b.title} (${b.isbn13}): ${res.status}`
        )
      } catch (err) {
        logger.error(
          `Error fetching Bookshop.org for ${b.title} (${b.isbn13}):`,
          { error: err }
        )
      }
      if (i < newBooks.length - 1) await wait.for({ seconds: 2 })
    }

    let insertedBooks = []
    if (newBooks.length > 0) {
      try {
        insertedBooks = await db
          .insert(bookTable)
          .values(
            newBooks.map((b) => ({
              grBookId: b.bookId,
              title: b.title,
              author: b.author,
              authorLf: b.authorLf,
              addAuthors: b.additionalAuthors,
              isbn: b.isbn,
              isbn13: b.isbn13,
              publisher: b.publisher,
              binding: b.binding,
              numOfPages: b.numberOfPages,
              yearPublished: b.yearPublished,
              originalPublicationYear: b.originalPublicationYear,
              tags: b.bookshelves,
            }))
          )
          .returning()
        logger.log(`Inserted books: ${JSON.stringify(insertedBooks)}`)
      } catch (error) {
        logger.error('Error inserting books', { error })
      }
    }
    // 3. Get all books again (to get IDs)
    const allBooks = await db
      .select()
      .from(bookTable)
      .where(
        or(
          ...results
            .filter((b) => b.isbn13)
            .map((b) => eq(bookTable.isbn13, b.isbn13!)),
          ...results
            .filter((b) => b.isbn)
            .map((b) => eq(bookTable.isbn, b.isbn!)),
          ...results
            .filter((b) => b.bookId)
            .map((b) => eq(bookTable.grBookId, b.bookId))
        )
      )
    // 4. Prepare userBook upserts
    const userBookRows = results
      .map((b) => {
        const dbBook = allBooks.find(
          (x) =>
            (b.isbn13 && x.isbn13 === b.isbn13) ||
            (b.isbn && x.isbn === b.isbn) ||
            (b.bookId && x.grBookId === b.bookId)
        )
        if (!dbBook) return null
        return {
          userId: payload.userId,
          bookId: dbBook.id,
          rating: b.userRating,
          dateRead: b.dateRead,
          dateAdded: b.dateAdded ? new Date(b.dateAdded) : null,
          bookshelves: b.bookshelves,
          bookshelvesWithPositions: b.bookshelvesWithPositions,
          exclusiveShelf: b.exclusiveShelf,
          review: b.myReview,
          spoiler: b.spoiler,
          privateNotes: b.privateNotes,
          readCount: b.readCount,
          ownedCopies: b.ownedCopies,
        }
      })
      .filter(Boolean)
    if (userBookRows.length > 0) {
      await db
        .insert(userBookTable)
        .values(userBookRows as (typeof userBookTable.$inferInsert)[])
        .onConflictDoNothing()
    }
    return {
      message: `Inserted ${insertedBooks.length} new books, upserted ${userBookRows.length} user-book relations for user ${payload.userId}`,
      insertedBooks: insertedBooks.length,
      userBooks: userBookRows.length,
    }
  },
})
