import { LogOut, Settings, ShieldCheck, UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth } from '@/app/providers/auth-context'
import { UserAvatar } from '@/components/user-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOutUser } from '@/lib/firebase/auth'
import { getErrorMessage } from '@/lib/errors'

export function UserMenu() {
  const { user, profile, isAdmin } = useAuth()
  const navigate = useNavigate()

  const displayName = profile?.displayName || user?.displayName || user?.email || 'Member'

  async function handleSignOut() {
    try {
      await signOutUser()
      toast.success('Signed out')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-1.5 pr-2.5">
          <UserAvatar
            name={displayName}
            email={profile?.email ?? user?.email}
            src={profile?.photoURL ?? user?.photoURL}
            className="size-7"
          />
          <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="truncate text-sm font-medium">{displayName}</span>
            <span className="text-muted-foreground truncate text-xs">
              {profile?.email ?? user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin ? (
          <DropdownMenuItem disabled>
            <ShieldCheck className="size-4" />
            Administrator
            <Badge variant="secondary" className="ml-auto">
              Full access
            </Badge>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onSelect={() => navigate('/account')}>
          <UserCircle className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/settings')}>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => void handleSignOut()}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
