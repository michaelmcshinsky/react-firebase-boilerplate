import {
  LayoutDashboard,
  Newspaper,
  Package,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '@/app/providers/auth-context'
import { Logo } from '@/components/logo'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  adminOnly?: boolean
  staffOnly?: boolean
}

const GROUPS: Array<{ label: string; items: NavItem[] }> = [
  {
    label: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Workspace',
    items: [
      { to: '/posts', label: 'Posts', icon: Newspaper },
      { to: '/products', label: 'Products', icon: Package, staffOnly: true },
      { to: '/users', label: 'Members', icon: Users, adminOnly: true },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/account', label: 'Profile', icon: UserCircle },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { isAdmin, isStaff, profile, user } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-5">
        <NavLink to="/dashboard" onClick={onNavigate} className="rounded-md">
          <Logo />
        </NavLink>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Main">
        {GROUPS.map((group) => {
          const items = group.items.filter(
            (item) => (!item.adminOnly || isAdmin) && (!item.staffOnly || isStaff),
          )
          if (items.length === 0) return null

          return (
            <div key={group.label} className="space-y-1">
              <p className="px-2.5 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                {group.label}
              </p>
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                    )
                  }
                >
                  <item.icon className="size-4" />
                  {item.label}
                  {item.adminOnly ? (
                    <ShieldCheck className="ml-auto size-3.5 text-muted-foreground/70" />
                  ) : null}
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>

      <div className="border-t px-4 py-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="size-1.5 rounded-full bg-success" />
          <span className="truncate text-muted-foreground">
            {profile?.email || user?.email || 'Signed in'}
          </span>
          {isAdmin ? (
            <Badge variant="secondary" className="ml-auto">
              Admin
            </Badge>
          ) : null}
        </div>
      </div>
    </div>
  )
}
