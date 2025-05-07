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
            <AvatarUI user={user} />
          ) : (
            <a
              href="#"
              className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
            >
              Log in
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
