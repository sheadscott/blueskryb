'use client'

import { CookieConsent } from '@/components/ui/cookie-consent'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsentWrapper() {
  const handleConsentChange = (preferences: CookiePreferences) => {
    // The PostHogProvider will handle this automatically via the custom event
    console.log('Cookie preferences updated:', preferences)
  }

  return <CookieConsent onConsentChange={handleConsentChange} />
}
