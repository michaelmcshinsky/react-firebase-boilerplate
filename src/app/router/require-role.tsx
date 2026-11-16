import type { ReactNode } from 'react'

import { useAuth } from '@/app/providers/auth-context'
import { Forbidden } from '@/components/forbidden'
import type { Role } from '@/types'

export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { status, hasRole } = useAuth()

  if (status === 'loading') return null
  if (!hasRole(roles)) {
    return <Forbidden required={roles.includes('admin') ? 'administrator' : 'staff'} />
  }

  return <>{children}</>
}
