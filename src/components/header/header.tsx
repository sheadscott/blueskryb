import BlueskyLogo from '@/components/bluesky-logo'
import LogoutButton from '@/components/logout-button'
import Image from 'next/image'
import Link from 'next/link'
import AvatarUI from './avatar'

export default function Header({ user }: { user: any }) {
  return (
    <header className="bg-white">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="p-1.5">
          <span className="sr-only">Your Company</span>
          <Image
            className="h-8 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt=""
            width={32}
            height={32}
          />
        </Link>
        <div className="py-6">
          {user ? (
            <div className="flex items-center gap-2">
              <AvatarUI user={user} />
              <LogoutButton />
            </div>
          ) : (
            <Link
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              href={`/login`}
              rel="noopener noreferrer"
            >
              <BlueskyLogo className="size-6 dark:invert fill-background" />
              Login with Bluesky
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
