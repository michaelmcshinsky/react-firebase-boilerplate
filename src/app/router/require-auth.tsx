import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/app/providers/auth-context'
import { ConfigurationRequired } from '@/components/configuration-required'
import { FullPageLoader } from '@/components/full-page-loader'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <FullPageLoader label="Checking your session…" />
  }

  if (status === 'unconfigured') {
    return <ConfigurationRequired />
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
    )
  }

  return <>{children}</>
}
