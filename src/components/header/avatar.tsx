import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AvatarUI({ user }: { user: any }) {
  return (
    <Avatar>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
