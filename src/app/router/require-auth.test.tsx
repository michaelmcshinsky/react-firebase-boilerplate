import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthContextValue } from '@/app/providers/auth-context'
import { useAuth } from '@/app/providers/auth-context'

import { RequireAuth } from './require-auth'

vi.mock('@/app/providers/auth-context', () => ({
  useAuth: vi.fn(),
}))

const mockedUseAuth = vi.mocked(useAuth)

function authValue(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    status: 'authenticated',
    user: null,
    profile: null,
    roles: ['user'],
    isAdmin: false,
    isStaff: false,
    emailVerified: true,
    error: null,
    hasRole: () => false,
    refresh: async () => {},
    ...overrides,
  }
}

function renderGuardedRoute() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/login" element={<p>login screen</p>} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <p>dashboard content</p>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RequireAuth', () => {
  beforeEach(() => {
    mockedUseAuth.mockReset()
  })

  it('renders a loader while the session is resolving', () => {
    mockedUseAuth.mockReturnValue(authValue({ status: 'loading' }))

    renderGuardedRoute()

    expect(screen.getByText('Checking your session…')).toBeInTheDocument()
    expect(screen.queryByText('dashboard content')).not.toBeInTheDocument()
  })

  it('redirects anonymous visitors to the sign-in screen', () => {
    mockedUseAuth.mockReturnValue(authValue({ status: 'unauthenticated', roles: [] }))

    renderGuardedRoute()

    expect(screen.getByText('login screen')).toBeInTheDocument()
  })

  it('renders the setup screen when Firebase is not configured', () => {
    mockedUseAuth.mockReturnValue(authValue({ status: 'unconfigured', roles: [] }))

    renderGuardedRoute()

    expect(
      screen.getByRole('heading', { name: 'Connect your Firebase project' }),
    ).toBeInTheDocument()
  })

  it('renders the protected content for a signed-in member', () => {
    mockedUseAuth.mockReturnValue(authValue())

    renderGuardedRoute()

    expect(screen.getByText('dashboard content')).toBeInTheDocument()
  })
})
