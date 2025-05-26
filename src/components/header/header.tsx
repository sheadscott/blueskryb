import { User } from '@/types/user'
import Link from 'next/link'
import BlueskrybLogoCombo from './blueskryb-logo-combo'
import ProfileDropdown from './profile-dropdown'

export default function Header({ user }: { user: User | null }) {
  console.log('USER', user)
  return (
    <header className="bg-white pt-4">
      <div
        className={`flex items-center justify-between max-w-4xl mx-auto mt-4 ${
          user ? 'content-center' : 'content-start'
        }`}
      >
        <Link href="/">
          <span className="sr-only">Blueskryb</span>
          <BlueskrybLogoCombo className="h-6 md:h-8 w-auto fill-primary" />
        </Link>
        {user ? (
          <div className="flex items-center gap-2">
            <ProfileDropdown user={user} />
          </div>
        ) : null}
      </div>
    </header>
  )
}
