import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'

import { getFirebase } from '@/lib/firebase/client'
import { getErrorMessage } from '@/lib/errors'
import { hasRole } from '@/lib/permissions'
import { ensureProfile, normalizeRoles, subscribeToProfile } from '@/services/users'
import type { Role, UserProfile } from '@/types'

import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context'

interface AuthState {
  status: AuthStatus
  user: User | null
  profile: UserProfile | null
  claimRoles: Role[]
  error: string | null
}

const initialState: AuthState = {
  status: 'loading',
  user: null,
  profile: null,
  claimRoles: [],
  error: null,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState)

  useEffect(() => {
    const firebase = getFirebase()
    if (!firebase) {
      setState({ ...initialState, status: 'unconfigured' })
      return
    }

    let cancelled = false
    let unsubscribeProfile: (() => void) | undefined

    const unsubscribeAuth = onAuthStateChanged(firebase.auth, async (user) => {
      unsubscribeProfile?.()
      unsubscribeProfile = undefined

      if (!user) {
        if (!cancelled) {
          setState({ ...initialState, status: 'unauthenticated' })
        }
        return
      }

      setState((previous) => ({ ...previous, status: 'loading', user, error: null }))

      let claimRoles: Role[] = []
      try {
        const token = await user.getIdTokenResult()
        claimRoles = normalizeRoles(token.claims.roles)
      } catch (error) {
        if (!cancelled) {
          setState((previous) => ({ ...previous, error: getErrorMessage(error) }))
        }
      }

      if (cancelled) return

      setState({
        status: 'authenticated',
        user,
        profile: null,
        claimRoles,
        error: null,
      })

      try {
        await ensureProfile(user)
      } catch (error) {
        if (!cancelled) {
          setState((previous) => ({ ...previous, error: getErrorMessage(error) }))
        }
      }

      if (cancelled) return

      unsubscribeProfile = subscribeToProfile(
        user.uid,
        (profile) => {
          if (!cancelled) {
            setState((previous) => ({ ...previous, profile }))
          }
        },
        (error) => {
          if (!cancelled) {
            setState((previous) => ({ ...previous, error: getErrorMessage(error) }))
          }
        },
      )
    })

    return () => {
      cancelled = true
      unsubscribeProfile?.()
      unsubscribeAuth()
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!state.user) return
    try {
      const token = await state.user.getIdToken(true)
      const result = await state.user.getIdTokenResult()
      void token
      setState((previous) => ({
        ...previous,
        claimRoles: normalizeRoles(result.claims.roles),
        profile: null,
      }))
      const profile = await ensureProfile(state.user)
      setState((previous) => ({ ...previous, profile }))
    } catch (error) {
      setState((previous) => ({ ...previous, error: getErrorMessage(error) }))
    }
  }, [state.user])

  const roles = useMemo<Role[]>(() => {
    if (state.claimRoles.length > 0) return state.claimRoles
    return normalizeRoles(state.profile?.roles)
  }, [state.claimRoles, state.profile?.roles])

  const value = useMemo<AuthContextValue>(
    () => ({
      status: state.status,
      user: state.user,
      profile: state.profile,
      roles,
      isAdmin: hasRole(roles, 'admin'),
      isStaff: hasRole(roles, ['admin', 'editor']),
      emailVerified: state.user?.emailVerified ?? false,
      error: state.error,
      hasRole: (required: Role | Role[]) => hasRole(roles, required),
      refresh,
    }),
    [state.status, state.user, state.profile, state.error, roles, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
