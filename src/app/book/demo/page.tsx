'use client'
import { useState } from 'react'

export default function BookshopDemo() {
  const [html, setHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isbn13 = '9780142437247'

  async function fetchBookshop() {
    setLoading(true)
    setHtml(null)
    const res = await fetch(`/api/bookshop-search?isbn13=${isbn13}`)
    const data = await res.json()
    setHtml(data.html)
    setLoading(false)
  }

  return (
    <main className="flex flex-col items-center gap-8">
      <h1 className="font-black text-3xl">Bookshop.org Puppeteer Demo</h1>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={fetchBookshop}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Bookshop Search'}
      </button>
      {html && (
        <div
          className="w-full max-w-2xl border rounded p-4 mt-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </main>
  )
}
