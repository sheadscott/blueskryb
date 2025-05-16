'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import BlueskyLogo from '../header/bluesky-logo'

export default function LoginButton() {
  return (
    <Link href={`/`} rel="noopener noreferrer">
      <Button type="button">
        <BlueskyLogo className="dark:invert fill-background" /> Login with
        Bluesky
      </Button>
    </Link>
  )
}
