// app/providers.tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { Suspense, useEffect, useState } from 'react'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  // marketing: boolean
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(false)
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

  useEffect(() => {
    // Check for existing cookie consent
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent')
      if (consent) {
        try {
          const preferences = JSON.parse(consent) as CookiePreferences
          setHasAnalyticsConsent(preferences.analytics)
          return preferences.analytics
        } catch (error) {
          console.error('Error parsing cookie consent:', error)
        }
      }
      return false
    }

    const initializePostHog = () => {
      if (
        isProduction &&
        process.env.NEXT_PUBLIC_POSTHOG_KEY &&
        !isInitialized
      ) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
          api_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
          person_profiles: 'identified_only',
          capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        })
        setIsInitialized(true)
      }
    }

    // Check initial consent
    const hasConsent = checkConsent()
    if (hasConsent) {
      initializePostHog()
    }

    // Listen for consent changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookie-consent' && e.newValue) {
        try {
          const preferences = JSON.parse(e.newValue) as CookiePreferences
          setHasAnalyticsConsent(preferences.analytics)
          if (preferences.analytics) {
            initializePostHog()
          } else if (isInitialized) {
            posthog.opt_out_capturing()
          }
        } catch (error) {
          console.error(
            'Error parsing cookie consent from storage event:',
            error
          )
        }
      }
    }

    // Listen for custom events (for same-tab updates)
    const handleConsentChange = (e: CustomEvent<CookiePreferences>) => {
      setHasAnalyticsConsent(e.detail.analytics)
      if (e.detail.analytics) {
        initializePostHog()
      } else if (isInitialized) {
        posthog.opt_out_capturing()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(
      'cookieConsentChanged',
      handleConsentChange as EventListener
    )

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(
        'cookieConsentChanged',
        handleConsentChange as EventListener
      )
    }
  }, [isProduction, isInitialized])

  // If not production or no analytics consent, just return children without PostHog wrapper
  if (!isProduction || !hasAnalyticsConsent || !isInitialized) {
    return <>{children}</>
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

  // Track pageviews only in production
  useEffect(() => {
    if (pathname && posthog && isProduction) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }

      posthog.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams, posthog, isProduction])

  return null
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
