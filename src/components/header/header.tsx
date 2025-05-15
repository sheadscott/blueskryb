import LoginButton from '@/components/auth/login-button'
import { User } from '@/types/user'
import Link from 'next/link'
import BlueskrybLogotype from './blueskryb-logotype'
import ProfileDropdown from './profile-dropdown'

export default function Header({ user }: { user: User | null }) {
  return (
    <header className="bg-white">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="p-1.5">
          <span className="sr-only">blueskryb Company</span>
          <BlueskrybLogotype className="h-8 w-auto fill-primary" />
        </Link>
        <div className="py-6 pr-2">
          {user ? (
            <div className="flex items-center gap-2">
              <ProfileDropdown user={user} />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  )
}
