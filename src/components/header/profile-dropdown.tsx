import Link from 'next/link'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@/types/user'
import LogoutLink from '../auth/logout-link'
import AvatarUI from './avatar'

export default function ProfileDropdown({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AvatarUI user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/${user.handle}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/${user.handle}/books`}>My Books</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogoutLink />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
