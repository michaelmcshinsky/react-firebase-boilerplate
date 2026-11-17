import { createBrowserRouter, Navigate } from 'react-router-dom'

import { FullPageLoader } from '@/components/full-page-loader'
import { AppShell } from '@/components/layout/app-shell'
import { PublicLayout } from '@/components/layout/public-layout'

import { RequireAuth } from './require-auth'
import { RequireRole } from './require-role'

/**
 * Every page below the landing screen is code-split. The marketing page stays
 * eager because it is the first paint for anonymous visitors; auth, dashboard
 * and CRUD pages load on demand, which keeps the initial bundle small.
 */
export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    hydrateFallbackElement: <FullPageLoader label="Loading…" />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { LandingPage } = await import('@/features/marketing/landing-page')
          return { Component: LandingPage }
        },
      },
      {
        path: 'login',
        lazy: async () => {
          const { LoginPage } = await import('@/features/auth/login-page')
          return { Component: LoginPage }
        },
      },
      {
        path: 'register',
        lazy: async () => {
          const { RegisterPage } = await import('@/features/auth/register-page')
          return { Component: RegisterPage }
        },
      },
      {
        path: 'forgot-password',
        lazy: async () => {
          const { ForgotPasswordPage } = await import('@/features/auth/forgot-password-page')
          return { Component: ForgotPasswordPage }
        },
      },
      {
        path: '*',
        lazy: async () => {
          const { NotFoundPage } = await import('@/features/marketing/not-found-page')
          return { Component: NotFoundPage }
        },
      },
    ],
  },
  {
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    hydrateFallbackElement: <FullPageLoader label="Loading your workspace…" />,
    children: [
      {
        path: 'dashboard',
        lazy: async () => {
          const { DashboardPage } = await import('@/features/dashboard/dashboard-page')
          return { Component: DashboardPage }
        },
      },
      {
        path: 'posts',
        lazy: async () => {
          const { PostsPage } = await import('@/features/posts/posts-page')
          return { Component: PostsPage }
        },
      },
      {
        path: 'account',
        lazy: async () => {
          const { AccountPage } = await import('@/features/account/account-page')
          return { Component: AccountPage }
        },
      },
      {
        path: 'settings',
        lazy: async () => {
          const { SettingsPage } = await import('@/features/settings/settings-page')
          return { Component: SettingsPage }
        },
      },
      {
        // Role guards double as layout routes so the page chunk is only
        // fetched after the guard allows it.
        element: <RequireRole roles={['admin', 'editor']} />,
        children: [
          {
            path: 'products',
            lazy: async () => {
              const { ProductsPage } = await import('@/features/products/products-page')
              return { Component: ProductsPage }
            },
          },
        ],
      },
      {
        element: <RequireRole roles={['admin']} />,
        children: [
          {
            path: 'users',
            lazy: async () => {
              const { UsersPage } = await import('@/features/users/users-page')
              return { Component: UsersPage }
            },
          },
        ],
      },
    ],
  },
  // Older links from the pre-v2 admin panel.
  { path: '/admin', element: <Navigate to="/dashboard" replace /> },
  { path: '/admin/dashboard', element: <Navigate to="/dashboard" replace /> },
  { path: '/admin/posts', element: <Navigate to="/posts" replace /> },
  { path: '/admin/products', element: <Navigate to="/products" replace /> },
  { path: '/admin/users', element: <Navigate to="/users" replace /> },
  { path: '/admin/settings', element: <Navigate to="/settings" replace /> },
  { path: '/admin/account', element: <Navigate to="/account" replace /> },
])
