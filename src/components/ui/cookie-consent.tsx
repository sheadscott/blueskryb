'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { BarChart3, Cookie, Settings, Shield, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

interface CookieConsentProps {
  onConsentChange?: (preferences: CookiePreferences) => void
}

export function CookieConsent({ onConsentChange }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Small delay to prevent flash
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    } else {
      try {
        const saved = JSON.parse(consent)
        setPreferences(saved)
        onConsentChange?.(saved)
      } catch (error) {
        console.error('Error parsing saved cookie preferences:', error)
      }
    }
  }, [onConsentChange])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs))
    localStorage.setItem('cookie-consent-date', new Date().toISOString())

    // Set a cookie to remember consent (expires in 1 year)
    document.cookie = `cookie-consent=${JSON.stringify(prefs)};max-age=${60 * 60 * 24 * 365};path=/;SameSite=Lax`

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(
      new CustomEvent('cookieConsentChanged', { detail: prefs })
    )

    setPreferences(prefs)
    onConsentChange?.(prefs)
    setIsVisible(false)
  }

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    savePreferences(allAccepted)
  }

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    savePreferences(necessaryOnly)
  }

  const acceptSelected = () => {
    savePreferences(preferences)
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return // Can't disable necessary cookies
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const dismissBanner = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-sm">Cookie Preferences</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            onClick={dismissBanner}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {!showDetails ? (
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              We use cookies to enhance your experience and analyze site usage.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="flex-1 text-xs"
                >
                  Accept All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessary}
                  className="flex-1 text-xs"
                >
                  Necessary Only
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="text-xs text-primary hover:underline h-auto p-1"
              >
                <Settings className="h-3 w-3 mr-1" />
                Customize
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Necessary Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-green-600" />
                  <Label htmlFor="necessary" className="text-xs font-medium">
                    Necessary
                  </Label>
                </div>
                <Switch
                  id="necessary"
                  checked={preferences.necessary}
                  disabled
                  className="scale-75"
                />
              </div>
              <p className="text-xs text-gray-500">
                Required for basic functionality and security.
              </p>
            </div>

            <Separator />

            {/* Analytics Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3 text-blue-600" />
                  <Label htmlFor="analytics" className="text-xs font-medium">
                    Analytics
                  </Label>
                </div>
                <Switch
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    updatePreference('analytics', checked)
                  }
                  className="scale-75"
                />
              </div>
              <p className="text-xs text-gray-500">
                Anonymous usage data via PostHog.
              </p>
            </div>

            <Separator />

            {/* Marketing Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Cookie className="h-3 w-3 text-purple-600" />
                  <Label htmlFor="marketing" className="text-xs font-medium">
                    Marketing
                  </Label>
                </div>
                <Switch
                  id="marketing"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    updatePreference('marketing', checked)
                  }
                  className="scale-75"
                />
              </div>
              <p className="text-xs text-gray-500">
                Relevant ads and campaigns.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={acceptSelected}
                  className="flex-1 text-xs"
                >
                  Save Preferences
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessary}
                  className="flex-1 text-xs"
                >
                  Necessary Only
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
                className="text-xs h-auto p-1"
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
