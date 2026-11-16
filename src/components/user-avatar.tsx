import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { initials } from '@/lib/utils'

interface UserAvatarProps {
  name?: string | null
  email?: string | null
  src?: string | null
  className?: string
}

export function UserAvatar({ name, email, src, className }: UserAvatarProps) {
  const label = name?.trim() || email?.split('@')[0] || 'Member'

  return (
    <Avatar className={cn('size-9', className)}>
      {src ? <AvatarImage src={src} alt={label} /> : null}
      <AvatarFallback>{initials(label)}</AvatarFallback>
    </Avatar>
  )
}
