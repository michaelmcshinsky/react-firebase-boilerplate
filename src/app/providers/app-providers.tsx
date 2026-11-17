import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from '@/components/error-boundary'

import { AuthProvider } from './auth-provider'
import { ThemeProvider } from './theme-provider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {/* Outside AuthProvider so a broken provider shows recovery UI, not a blank page. */}
      <ErrorBoundary>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
