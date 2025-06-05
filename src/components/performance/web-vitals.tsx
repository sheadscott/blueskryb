'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Only report in production and if PostHog is available
    if (
      process.env.NODE_ENV === 'production' &&
      typeof window !== 'undefined' &&
      window.posthog
    ) {
      window.posthog.capture('Web Vitals', {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_id: metric.id,
        metric_rating: metric.rating,
        page_url: window.location.href,
      })
    }

    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', metric)
    }
  })

  return null
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    posthog?: {
      capture: (
        event: string,
        properties: Record<string, string | number>
      ) => void
    }
  }
}
