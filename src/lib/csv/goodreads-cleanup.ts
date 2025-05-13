export interface GoodreadsCsvRow {
  'Book Id': string
  Title: string
  Author: string
  'Author l-f': string
  'Additional Authors': string
  ISBN: string
  ISBN13: string
  'My Rating': string
  Publisher: string
  Binding: string
  'Number of Pages': string
  'Year Published': string
  'Original Publication Year': string
  'Date Read': string
  'Date Added': string
  Bookshelves: string
  'Bookshelves with positions': string
  'Exclusive Shelf': string
  'My Review': string
  Spoiler: string
  'Private Notes': string
  'Read Count': string
  'Owned Copies': string
  [key: string]: string
}

export interface CleanedGoodreadsBook {
  bookId: string
  title: string
  author: string
  authorLf: string
  additionalAuthors: string | null
  isbn: string | null
  isbn13: string | null
  bookshopIsbn13: string | null // This is optional because it's not always available
  userRating: number
  publisher: string | null
  binding: string | null
  numberOfPages: number | null
  yearPublished: number | null
  originalPublicationYear: number | null
  dateRead: string | null
  dateAdded: string
  bookshelves: string[]
  bookshelvesWithPositions: string | null
  exclusiveShelf: string | null
  myReview: string | null
  spoiler: string | null
  privateNotes: string | null
  readCount: number
  ownedCopies: number
}

export function cleanGoodreadsCsvRow(
  data: GoodreadsCsvRow
): CleanedGoodreadsBook | null {
  try {
    let cleanedIsbn = null
    if (data.ISBN) {
      const tempIsbn = String(data.ISBN).replace(/=|"| /g, '')
      cleanedIsbn = tempIsbn === '' ? null : tempIsbn
    }
    let cleanedIsbn13 = null
    if (data.ISBN13) {
      const tempIsbn13 = String(data.ISBN13).replace(/=|"| /g, '')
      cleanedIsbn13 = tempIsbn13 === '' ? null : tempIsbn13
    }
    const cleanedData: CleanedGoodreadsBook = {
      bookId: data['Book Id'] || '',
      title: data.Title || '',
      author: data.Author || '',
      authorLf: data['Author l-f'] || '',
      additionalAuthors: data['Additional Authors'] || null,
      isbn: cleanedIsbn,
      isbn13: cleanedIsbn13,
      bookshopIsbn13: null,
      userRating: data['My Rating']
        ? parseInt(String(data['My Rating']), 10)
        : 0,
      publisher: data.Publisher || null,
      binding: data.Binding || null,
      numberOfPages: data['Number of Pages']
        ? parseInt(String(data['Number of Pages']), 10)
        : null,
      yearPublished: data['Year Published']
        ? parseInt(String(data['Year Published']), 10)
        : null,
      originalPublicationYear: data['Original Publication Year']
        ? parseInt(String(data['Original Publication Year']), 10)
        : null,
      dateRead: data['Date Read'] || null,
      dateAdded: data['Date Added'] || '',
      bookshelves: data.Bookshelves
        ? String(data.Bookshelves)
            .split(', ')
            .map((s: string) => s.trim())
        : [],
      bookshelvesWithPositions: data['Bookshelves with positions'] || null,
      exclusiveShelf: data['Exclusive Shelf'] || null,
      myReview: data['My Review'] || null,
      spoiler: data.Spoiler || null,
      privateNotes: data['Private Notes'] || null,
      readCount: data['Read Count']
        ? parseInt(String(data['Read Count']), 10)
        : 0,
      ownedCopies: data['Owned Copies']
        ? parseInt(String(data['Owned Copies']), 10)
        : 0,
    }
    // Validation checks
    if (cleanedData.title && cleanedData.bookId) {
      if (
        (cleanedData.numberOfPages === null ||
          !isNaN(cleanedData.numberOfPages)) &&
        (cleanedData.yearPublished === null ||
          !isNaN(cleanedData.yearPublished)) &&
        (cleanedData.originalPublicationYear === null ||
          !isNaN(cleanedData.originalPublicationYear)) &&
        !isNaN(cleanedData.userRating) &&
        !isNaN(cleanedData.readCount) &&
        !isNaN(cleanedData.ownedCopies)
      ) {
        return cleanedData
      }
    }
    return null
  } catch {
    return null
  }
}
