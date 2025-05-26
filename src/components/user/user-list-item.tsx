import { User } from '@/types/user'
import Image from 'next/image'
import Link from 'next/link'

export default function UserListItem({ user }: { user: User }) {
  return (
    <Link href={`https://bsky.app/profile/${user.handle}`}>
      <div className="mb-4 hover:opacity-50 transition-opacity">
        <Image
          src={user.avatar || ''}
          alt={user.displayName || user.handle}
          width={32}
          height={32}
          className="rounded-full inline-block mr-2"
          loading="lazy"
        />
        {user.displayName || user.handle}
      </div>
    </Link>
  )
}
