import BookCover from '@/components/book/cover'
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
      <ul className="space-y-4">
        {userWithBooks.books.map((book) => (
          <li className="flex gap-4" key={book.title + book.author}>
            <BookCover isbn={book.bookshopIsbn13} />
            <div className="flex flex-col">
              <strong>{book.title}</strong>
              <div>by {book.author}</div>
              <div>{book.bookshopIsbn13}</div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
