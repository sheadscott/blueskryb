/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type LexiconDoc,
  Lexicons,
  ValidationError,
  type ValidationResult,
} from '@atproto/lexicon'
import { type $Typed, is$typed, maybe$typed } from './util.js'

export const schemaDict = {
  CloudBlueskrybBook: {
    lexicon: 1,
    id: 'cloud.blueskryb.book',
    defs: {
      main: {
        type: 'record',
        key: 'tid',
        description: "A book in the user's library",
        record: {
          type: 'object',
          required: ['title', 'authors', 'createdAt'],
          properties: {
            title: {
              type: 'string',
              description: 'The title of the book',
              minLength: 1,
              maxLength: 512,
            },
            authors: {
              type: 'array',
              description: 'The authors of the book',
              items: {
                type: 'string',
                minLength: 1,
                maxLength: 256,
              },
            },
            isbn10: {
              type: 'string',
              description: 'The ISBN-10 of the book',
              minLength: 10,
              maxLength: 10,
            },
            isbn13: {
              type: 'string',
              description: 'The ISBN-13 of the book',
              minLength: 13,
              maxLength: 13,
            },
            goodreadsId: {
              type: 'integer',
              description: 'The Goodreads ID of the book',
              minimum: 1,
            },
            readingStatus: {
              type: 'string',
              knownValues: [
                'cloud.blueskryb.defs#finished',
                'cloud.blueskryb.defs#reading',
                'cloud.blueskryb.defs#wantToRead',
                'cloud.blueskryb.defs#notFinished',
              ],
            },
            rating: {
              type: 'integer',
              description:
                "User's rating of the book (1-10) which will be mapped to 1-5 stars",
              minimum: 1,
              maximum: 10,
            },
            publisher: {
              type: 'string',
              description: 'The publisher of the book',
              minLength: 1,
              maxLength: 256,
            },
            binding: {
              type: 'string',
              description:
                'The binding of the book (hardcover, paperback, kindle, etc.)',
              minLength: 1,
              maxLength: 256,
            },
            numberOfPages: {
              type: 'integer',
              description: 'The number of pages in the book',
              minimum: 1,
            },
            publicationYear: {
              type: 'integer',
              description: 'The year the book was published',
            },
            originalPublicationYear: {
              type: 'integer',
              description: 'The year the book was originally published',
            },
            dateRead: {
              type: 'string',
              format: 'datetime',
              description: 'The date the user read the book',
            },
            dateAdded: {
              type: 'string',
              format: 'datetime',
              description: 'The date the user added the book to their library',
            },
            tags: {
              type: 'array',
              description: 'The tags the user has applied to the book',
              items: {
                type: 'string',
                minLength: 1,
                maxLength: 256,
              },
            },
            privateNotes: {
              type: 'string',
              description: "The user's private notes about the book",
              maxGraphemes: 15000,
            },
            readCount: {
              type: 'integer',
              description: 'The number of times the user has read the book',
              minimum: 0,
            },
            ownedCopies: {
              type: 'integer',
              description: 'The number of copies the user owns of the book',
              minimum: 0,
            },
            review: {
              type: 'string',
              description: "The user's review of the book",
              maxGraphemes: 15000,
            },
            spoiler: {
              type: 'boolean',
              description:
                'Whether the user has marked the entire book review as a spoiler',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
            startedAt: {
              type: 'string',
              format: 'datetime',
              description: 'The date the user started reading the book',
            },
            finishedAt: {
              type: 'string',
              format: 'datetime',
              description: 'The date the user finished reading the book',
            },
          },
        },
      },
    },
  },
  CloudBlueskrybDefs: {
    lexicon: 1,
    id: 'cloud.blueskryb.defs',
    defs: {
      finished: {
        type: 'token',
        description: 'User has finished reading the book',
      },
      reading: {
        type: 'token',
        description: 'User is currently reading the book',
      },
      wantToRead: {
        type: 'token',
        description: 'User wants to read the book',
      },
      notFinished: {
        type: 'token',
        description: 'User has stopped reading the book',
      },
    },
  },
  AppBskyActorProfile: {
    lexicon: 1,
    id: 'app.bsky.actor.profile',
    defs: {
      main: {
        type: 'record',
        description: 'A declaration of a Bluesky account profile.',
        key: 'literal:self',
        record: {
          type: 'object',
          properties: {
            displayName: {
              type: 'string',
              maxGraphemes: 64,
              maxLength: 640,
            },
            description: {
              type: 'string',
              description: 'Free-form profile description text.',
              maxGraphemes: 256,
              maxLength: 2560,
            },
            avatar: {
              type: 'blob',
              description:
                "Small image to be displayed next to posts from account. AKA, 'profile picture'",
              accept: ['image/png', 'image/jpeg'],
              maxSize: 1000000,
            },
            banner: {
              type: 'blob',
              description:
                'Larger horizontal image to display behind profile view.',
              accept: ['image/png', 'image/jpeg'],
              maxSize: 1000000,
            },
            labels: {
              type: 'union',
              description:
                'Self-label values, specific to the Bluesky application, on the overall account.',
              refs: ['lex:com.atproto.label.defs#selfLabels'],
            },
            joinedViaStarterPack: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
            },
            pinnedPost: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
    },
  },
  ComAtprotoRepoStrongRef: {
    lexicon: 1,
    id: 'com.atproto.repo.strongRef',
    description: 'A URI with a content-hash fingerprint.',
    defs: {
      main: {
        type: 'object',
        required: ['uri', 'cid'],
        properties: {
          uri: {
            type: 'string',
            format: 'at-uri',
          },
          cid: {
            type: 'string',
            format: 'cid',
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)

export function validate<T extends { $type: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType: true,
): ValidationResult<T>
export function validate<T extends { $type?: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: false,
): ValidationResult<T>
export function validate(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: boolean,
): ValidationResult {
  return (requiredType ? is$typed : maybe$typed)(v, id, hash)
    ? lexicons.validate(`${id}#${hash}`, v)
    : {
        success: false,
        error: new ValidationError(
          `Must be an object with "${hash === 'main' ? id : `${id}#${hash}`}" $type property`,
        ),
      }
}

export const ids = {
  CloudBlueskrybBook: 'cloud.blueskryb.book',
  CloudBlueskrybDefs: 'cloud.blueskryb.defs',
  AppBskyActorProfile: 'app.bsky.actor.profile',
  ComAtprotoRepoStrongRef: 'com.atproto.repo.strongRef',
} as const
