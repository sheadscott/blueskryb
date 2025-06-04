import { PostHog } from 'posthog-node'

export default function PostHogClient() {
  // Use server-side environment variables (without NEXT_PUBLIC_ prefix)
  const apiKey = process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (!apiKey) {
    console.error(
      'PostHog API key not found. Set POSTHOG_KEY environment variable.'
    )
    throw new Error('PostHog API key not found')
  }

  console.log(
    'Initializing server-side PostHog client with key:',
    apiKey.substring(0, 8) + '...'
  )

  const posthogClient = new PostHog(apiKey, {
    host: host || 'https://us.i.posthog.com',
    flushAt: 1,
    flushInterval: 0,
  })

  return posthogClient
}
