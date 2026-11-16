import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthContextValue } from '@/app/providers/auth-context'
import { useAuth } from '@/app/providers/auth-context'
import type { Role } from '@/types'

import { RequireRole } from './require-role'

vi.mock('@/app/providers/auth-context', () => ({
  useAuth: vi.fn(),
}))

const mockedUseAuth = vi.mocked(useAuth)

function authValue(roles: Role[], overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    status: 'authenticated',
    user: null,
    profile: null,
    roles,
    isAdmin: roles.includes('admin'),
    isStaff: roles.includes('admin') || roles.includes('editor'),
    emailVerified: true,
    error: null,
    hasRole: (required) => {
      const wanted = Array.isArray(required) ? required : [required]
      return wanted.some((role) => roles.includes(role))
    },
    refresh: async () => {},
    ...overrides,
  }
}

/** Renders the layout-route form, which guards a nested page via <Outlet />. */
function renderLayoutRoute(roles: string[]) {
  return render(
    <MemoryRouter initialEntries={['/users']}>
      <Routes>
        <Route element={<RequireRole roles={roles as Role[]} />}>
          <Route path="/users" element={<p>members page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('RequireRole', () => {
  beforeEach(() => {
    mockedUseAuth.mockReset()
  })

  it('renders nested routes for an allowed role', () => {
    mockedUseAuth.mockReturnValue(authValue(['admin']))

    renderLayoutRoute(['admin'])

    expect(screen.getByText('members page')).toBeInTheDocument()
  })

  it('shows a 403 screen for a member without the role', () => {
    mockedUseAuth.mockReturnValue(authValue(['user']))

    renderLayoutRoute(['admin'])

    expect(screen.getByRole('heading', { name: 'Access restricted' })).toBeInTheDocument()
    expect(screen.queryByText('members page')).not.toBeInTheDocument()
  })

  it('accepts any of several allowed roles', () => {
    mockedUseAuth.mockReturnValue(authValue(['editor']))

    renderLayoutRoute(['admin', 'editor'])

    expect(screen.getByText('members page')).toBeInTheDocument()
  })

  it('renders nothing while auth is loading', () => {
    mockedUseAuth.mockReturnValue(authValue([], { status: 'loading' }))

    renderLayoutRoute(['admin'])

    expect(screen.queryByText('members page')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Access restricted' })).not.toBeInTheDocument()
  })

  it('supports the children form without a router outlet', () => {
    mockedUseAuth.mockReturnValue(authValue(['admin']))

    render(
      <MemoryRouter>
        <RequireRole roles={['admin']}>
          <p>wrapped page</p>
        </RequireRole>
      </MemoryRouter>,
    )

    expect(screen.getByText('wrapped page')).toBeInTheDocument()
  })
})
