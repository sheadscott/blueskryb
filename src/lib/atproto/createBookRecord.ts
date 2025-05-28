import * as Book from '@/lexicon/types/cloud/blueskryb/book'
import { Agent } from '@atproto/api'
import { TID } from '@atproto/common'

export interface CreateBookRecordParams {
  title: string
  authors: string[]
  isbn10?: string
  isbn13?: string
  goodreadsId?: number
  readingStatus?:
    | 'cloud.blueskryb.defs#finished'
    | 'cloud.blueskryb.defs#reading'
    | 'cloud.blueskryb.defs#wantToRead'
    | 'cloud.blueskryb.defs#notFinished'
  rating?: number
  publisher?: string
  binding?: string
  numberOfPages?: number
  publicationYear?: number
  originalPublicationYear?: number
  dateRead?: string
  dateAdded?: string
  tags?: string[]
  privateNotes?: string
  readCount?: number
  ownedCopies?: number
  review?: string
  spoiler?: boolean
  startedAt?: string
  finishedAt?: string
}

export async function createBookRecord(
  agent: Agent,
  params: CreateBookRecordParams
): Promise<{ uri: string; cid: string }> {
  // Generate a new record key
  const rkey = TID.nextStr()

  // Construct the book record
  const record: Book.Record = {
    $type: 'cloud.blueskryb.book',
    title: params.title,
    authors: params.authors,
    createdAt: new Date().toISOString(),
    ...(params.isbn10 && { isbn10: params.isbn10 }),
    ...(params.isbn13 && { isbn13: params.isbn13 }),
    ...(params.goodreadsId && { goodreadsId: params.goodreadsId }),
    ...(params.readingStatus && { readingStatus: params.readingStatus }),
    ...(params.rating && { rating: params.rating }),
    ...(params.publisher && { publisher: params.publisher }),
    ...(params.binding && { binding: params.binding }),
    ...(params.numberOfPages && { numberOfPages: params.numberOfPages }),
    ...(params.publicationYear && { publicationYear: params.publicationYear }),
    ...(params.originalPublicationYear && {
      originalPublicationYear: params.originalPublicationYear,
    }),
    ...(params.dateRead && { dateRead: params.dateRead }),
    ...(params.dateAdded && { dateAdded: params.dateAdded }),
    ...(params.tags && { tags: params.tags }),
    ...(params.privateNotes && { privateNotes: params.privateNotes }),
    ...(params.readCount && { readCount: params.readCount }),
    ...(params.ownedCopies && { ownedCopies: params.ownedCopies }),
    ...(params.review && { review: params.review }),
    ...(params.spoiler !== undefined && { spoiler: params.spoiler }),
    ...(params.startedAt && { startedAt: params.startedAt }),
    ...(params.finishedAt && { finishedAt: params.finishedAt }),
  }

  // Validate the record
  const validation = Book.validateRecord(record)
  if (!validation.success) {
    throw new Error(`Invalid book record: ${JSON.stringify(validation.error)}`)
  }

  // Write the book record to the user's repository
  const response = await agent.com.atproto.repo.putRecord({
    repo: agent.assertDid,
    collection: 'cloud.blueskryb.book',
    rkey,
    record,
    validate: false,
  })

  return {
    uri: response.data.uri,
    cid: response.data.cid,
  }
}
