import LoginButton from '@/components/auth/login-button'
import { getAgent } from '@/lib/atproto-agent'
import { createBookRecord } from '@/lib/atproto/createBookRecord'
import getSession from '@/lib/iron'
import { redirect } from 'next/navigation'

async function handleCreateBook(formData: FormData) {
  'use server'

  const session = await getSession()
  const agent = await getAgent()

  if (!session.user || !agent) {
    throw new Error('Authentication required')
  }

  const title = formData.get('title') as string
  const authorInput = formData.get('author') as string

  if (!title || !authorInput) {
    throw new Error('Title and author are required')
  }

  // Split authors by comma and trim whitespace
  const authors = authorInput
    .split(',')
    .map((author) => author.trim())
    .filter(Boolean)

  if (authors.length === 0) {
    throw new Error('At least one author is required')
  }

  try {
    const result = await createBookRecord(agent, {
      title,
      authors,
      readingStatus: 'cloud.blueskryb.defs#finished',
      dateAdded: new Date().toISOString(),
    })

    console.log('Book record created:', result.uri)

    // Redirect to the user's books page or show success
    redirect(`/${session.user.handle}/books`)
  } catch (error) {
    console.error('Failed to create book record:', error)
    throw error
  }
}

export default async function CreateBookPage() {
  const session = await getSession()
  const agent = await getAgent()

  if (!session.user) {
    return (
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <span>
          You need to be logged in to create a book record. <LoginButton />
        </span>
      </main>
    )
  }

  if (!agent) {
    return (
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <span>
          Something went wrong getting your data from Bluesky. <LoginButton />
        </span>
      </main>
    )
  }

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Add a Book</h1>

      <form action={handleCreateBook} className="w-full space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Book Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter book title"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium mb-2">
            Author(s)
          </label>
          <input
            type="text"
            id="author"
            name="author"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter author name(s), separated by commas"
          />
          <p className="text-sm text-gray-500 mt-1">
            For multiple authors, separate with commas (e.g., &quot;Jane Doe,
            John Smith&quot;)
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Add Book
        </button>
      </form>
    </main>
  )
}
