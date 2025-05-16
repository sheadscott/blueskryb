'use client'

import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'
// This is the logout button
export default function LogoutButton() {
  const router = useRouter()

  // Handle the form submission
  const handleClick = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault()

    // Sign out
    await signOut()

    router.push(`/`)
  }

  return (
    <Button type="button" onClick={handleClick}>
      Logout
    </Button>
  )
}
