import { getUserWithBooks } from '@/lib/db/books/get-all-user-books'
import { notFound } from 'next/navigation'

export default async function HandlePage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const userWithBooks = await getUserWithBooks(handle)
  if (!userWithBooks) return notFound()

  return (
    <>
      <h1 className="font-bold text-lg pb-4">{handle} Books</h1>
      <ul className="space-y-2">
        {userWithBooks.books.map((book) => (
          <li key={book.title + book.author}>
            <strong>{book.title}</strong> by {book.author}
          </li>
        ))}
      </ul>
    </>
  )
}
