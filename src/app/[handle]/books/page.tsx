import { getUserWithBooks } from '@/lib/db/books/get-all-user-books'
import { notFound } from 'next/navigation'

interface HandlePageProps {
  params: { handle: string }
}

export default async function HandlePage({ params }: HandlePageProps) {
  const { handle } = params
  console.log('handle', handle)
  console.log('About to call getUserWithBooks', handle)
  const userWithBooks = await getUserWithBooks(handle)
  if (!userWithBooks) return notFound()

  return (
    <main>
      <h1>{handle} Books</h1>
      <ul>
        {userWithBooks.books.map((book) => (
          <li key={book.title + book.author}>
            <strong>{book.title}</strong> by {book.author}
          </li>
        ))}
      </ul>
    </main>
  )
}
