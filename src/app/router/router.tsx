import { createBrowserRouter, Navigate } from 'react-router-dom'

import { AppShell } from '@/components/layout/app-shell'
import { PublicLayout } from '@/components/layout/public-layout'
import { AccountPage } from '@/features/account/account-page'
import { ForgotPasswordPage } from '@/features/auth/forgot-password-page'
import { LoginPage } from '@/features/auth/login-page'
import { RegisterPage } from '@/features/auth/register-page'
import { DashboardPage } from '@/features/dashboard/dashboard-page'
import { LandingPage } from '@/features/marketing/landing-page'
import { NotFoundPage } from '@/features/marketing/not-found-page'
import { PostsPage } from '@/features/posts/posts-page'
import { ProductsPage } from '@/features/products/products-page'
import { SettingsPage } from '@/features/settings/settings-page'
import { UsersPage } from '@/features/users/users-page'

import { RequireAuth } from './require-auth'
import { RequireRole } from './require-role'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'posts', element: <PostsPage /> },
      {
        path: 'products',
        element: (
          <RequireRole roles={['admin', 'editor']}>
            <ProductsPage />
          </RequireRole>
        ),
      },
      {
        path: 'users',
        element: (
          <RequireRole roles={['admin']}>
            <UsersPage />
          </RequireRole>
        ),
      },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'account', element: <AccountPage /> },
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
