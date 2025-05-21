/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../lexicons'
import { type $Typed, is$typed as _is$typed, type OmitKey } from '../../../util'

const is$typed = _is$typed,
  validate = _validate
const id = 'cloud.blueskryb.book'

export interface Record {
  $type: 'cloud.blueskryb.book'
  /** The title of the book */
  title: string
  /** The authors of the book */
  authors: string[]
  /** The ISBN-10 of the book */
  isbn10?: string
  /** The ISBN-13 of the book */
  isbn13?: string
  /** The Goodreads ID of the book */
  goodreadsId?: number
  readingStatus?:
    | 'cloud.blueskryb.defs#finished'
    | 'cloud.blueskryb.defs#reading'
    | 'cloud.blueskryb.defs#wantToRead'
    | 'cloud.blueskryb.defs#notFinished'
    | (string & {})
  /** User's rating of the book (1-10) which will be mapped to 1-5 stars */
  rating?: number
  /** The publisher of the book */
  publisher?: string
  /** The binding of the book (hardcover, paperback, kindle, etc.) */
  binding?: string
  /** The number of pages in the book */
  numberOfPages?: number
  /** The year the book was published */
  publicationYear?: number
  /** The year the book was originally published */
  originalPublicationYear?: number
  /** The date the user read the book */
  dateRead?: string
  /** The date the user added the book to their library */
  dateAdded?: string
  /** The tags the user has applied to the book */
  tags?: string[]
  /** The user's private notes about the book */
  privateNotes?: string
  /** The number of times the user has read the book */
  readCount?: number
  /** The number of copies the user owns of the book */
  ownedCopies?: number
  /** The user's review of the book */
  review?: string
  /** Whether the user has marked the entire book review as a spoiler */
  spoiler?: boolean
  createdAt: string
  /** The date the user started reading the book */
  startedAt?: string
  /** The date the user finished reading the book */
  finishedAt?: string
  [k: string]: unknown
}

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
