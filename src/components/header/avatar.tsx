import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/types/user'

export default function AvatarUI({ user }: { user: User }) {
  return (
    <Avatar>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
