'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signInWithBluesky } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

// This is the login page
export default function Page() {
  const router = useRouter()
  const [handle, setHandle] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Remove the @ symbol from the handle
  useEffect(() => {
    setHandle(handle.replace('@', ''))
  }, [handle])

  // Handle the form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!handle) {
      return
    }

    try {
      const url: string = await signInWithBluesky(handle)
      router.push(url)
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes('Failed to resolve identity')
      ) {
        setError(
          'No Bluesky user was found that matches that handle. Please check the spelling and try again.'
        )
      } else {
        setError('Failed to sign in. Please try again later.')
      }
    }
  }

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="handle"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Bluesky Handle
          </label>
          <div className="mt-2">
            <Input
              id="handle"
              name="handle"
              type="text"
              placeholder="handle.bsky.social"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
            />
          </div>
        </div>
        <Button type="submit">Sign in with Bluesky</Button>
      </form>
    </main>
  )
}
