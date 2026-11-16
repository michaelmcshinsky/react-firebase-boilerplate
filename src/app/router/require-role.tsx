import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import { useAuth } from '@/app/providers/auth-context'
import { Forbidden } from '@/components/forbidden'
import type { Role } from '@/types'

/**
 * Renders `children` when the current member holds one of `roles`, otherwise a
 * 403 screen. With no children it acts as a layout route and renders the
 * nested `Outlet`, which lets routes keep their guard above the lazy import.
 */
export function RequireRole({ roles, children }: { roles: Role[]; children?: ReactNode }) {
  const { status, hasRole } = useAuth()

  if (status === 'loading') return null
  if (!hasRole(roles)) {
    return <Forbidden required={roles.includes('admin') ? 'administrator' : 'staff'} />
  }

  return <>{children ?? <Outlet />}</>
}
