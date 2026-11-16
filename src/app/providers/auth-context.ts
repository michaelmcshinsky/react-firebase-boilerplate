import { createContext, useContext } from 'react'
import type { User } from 'firebase/auth'

import type { Role, UserProfile } from '@/types'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'unconfigured'

export interface AuthContextValue {
  status: AuthStatus
  user: User | null
  profile: UserProfile | null
  roles: Role[]
  isAdmin: boolean
  isStaff: boolean
  emailVerified: boolean
  error: string | null
  hasRole: (required: Role | Role[]) => boolean
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>.')
  }
  return context
}
