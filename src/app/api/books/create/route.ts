import { CreateBookParams, createNewBook } from '@/lib/db/books/create-new-book'
import { db } from '@/lib/db/db'
import { book as bookTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      )
    }

    if (!body.author || typeof body.author !== 'string') {
      return NextResponse.json(
        { error: 'Author is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate optional fields if provided
    if (body.isbn13 && typeof body.isbn13 !== 'string') {
      return NextResponse.json(
        { error: 'ISBN13 must be a string' },
        { status: 400 }
      )
    }

    if (body.coverImageUrl && typeof body.coverImageUrl !== 'string') {
      return NextResponse.json(
        { error: 'Cover image URL must be a string' },
        { status: 400 }
      )
    }

    if (body.grBookId && typeof body.grBookId !== 'string') {
      return NextResponse.json(
        { error: 'Goodreads Book ID must be a string' },
        { status: 400 }
      )
    }

    const bookParams: CreateBookParams = {
      title: body.title.trim(),
      author: body.author.trim(),
      isbn13: body.isbn13?.trim(),
      coverImageUrl: body.coverImageUrl?.trim(),
      grBookId: body.grBookId?.trim(),
    }

    // Check if book with same ISBN13 already exists
    if (bookParams.isbn13) {
      const [existingBook] = await db
        .select()
        .from(bookTable)
        .where(eq(bookTable.isbn13, bookParams.isbn13))
        .limit(1)

      if (existingBook) {
        return NextResponse.json(
          {
            message: 'Book already exists',
            book: existingBook,
          },
          { status: 200 }
        )
      }
    }

    const newBook = await createNewBook(bookParams)

    return NextResponse.json(
      {
        message: 'Book created successfully',
        book: newBook,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating book:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
