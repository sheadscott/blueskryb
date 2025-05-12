import {
  date,
  integer,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const authState = pgTable('authState', {
  key: text('key').primaryKey(),
  state: text('state').notNull(),
})

export const authSession = pgTable('authSession', {
  key: text('key').primaryKey(),
  session: text('session').notNull(),
})

// Create a user table with the following columns:
// - id: text (primary key) auto-increment
// - did: text
// - email: text (optional)
// - name: text (optional)
// - createdAt: timestamp
// - updatedAt: timestamp

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  did: text('did').notNull(),
  email: text('email'),
  name: text('name'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const book = pgTable('book', {
  id: serial('id').primaryKey(),
  grBookId: text('gr_book_id').unique(),
  isbn: text('isbn').unique(),
  isbn13: text('isbn13').unique(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  authorLf: text('author_lf'),
  addAuthors: text('add_authors'),
  avgRating: numeric('avg_rating', { precision: 3, scale: 2 }),
  publisher: text('publisher'),
  binding: text('binding'),
  numOfPages: integer('num_of_pages'),
  yearPublished: integer('year_published'),
  originalPublicationYear: integer('original_publication_year'),

  synopsis: text('synopsis'),
  tags: text('tags').array(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),

  bookshopIsbnId: integer('bookshop_isbn_id').references(() => bookshopISBN.id),
})

export const userBook = pgTable(
  'userBook',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    bookId: integer('book_id')
      .notNull()
      .references(() => book.id, { onDelete: 'cascade' }),
    rating: integer('rating'),
    dateRead: text('date_read'),
    dateAdded: date('date_added'),
    bookshelves: text('bookshelves').array(),
    bookshelvesWithPositions: text('bookshelves_with_positions'),
    exclusiveShelf: text('exclusive_shelf'),
    review: text('review'),
    spoiler: text('spoiler'),
    privateNotes: text('private_notes'),
    readCount: integer('read_count').notNull().default(0),
    ownedCopies: integer('owned_copies').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  // (table) => ({
  //   pk: [table.userId, table.bookId],
  // })
  (table) => [primaryKey({ columns: [table.userId, table.bookId] })]
)

export const bookshopISBN = pgTable('bookshopISBN', {
  id: serial('id').primaryKey(),
  isbn13: text('isbn13').notNull().unique(),
})

export const bookshopISBNBook = pgTable(
  'bookshopISBNBook',
  {
    bookshopISBNId: integer('bookshop_isbn_id')
      .notNull()
      .references(() => bookshopISBN.id, { onDelete: 'cascade' }),
    bookId: integer('book_id')
      .notNull()
      .references(() => book.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.bookshopISBNId, table.bookId] })]
)
