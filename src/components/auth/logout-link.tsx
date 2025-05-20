'use client'

import { signOut } from '@/lib/actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MouseEvent } from 'react'

export default function LogoutLink() {
  const router = useRouter()

  // Handle the form submission
  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    // Sign out
    await signOut()

    router.push(`/`)
  }

  return (
    <Link href="/" onClick={handleClick}>
      Logout
    </Link>
  )
}
