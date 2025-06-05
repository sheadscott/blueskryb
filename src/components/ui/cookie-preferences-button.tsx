'use client'

import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

export function CookiePreferencesButton() {
  const openPreferences = () => {
    // Clear existing consent to force the dialog to show
    localStorage.removeItem('cookie-consent')
    // Reload the page to show the consent dialog
    window.location.reload()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={openPreferences}
      className="text-sm"
    >
      <Settings className="h-4 w-4 mr-2" />
      Cookie Preferences
    </Button>
  )
}
