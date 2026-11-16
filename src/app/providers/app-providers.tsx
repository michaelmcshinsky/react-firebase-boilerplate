import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'

import { AuthProvider } from './auth-provider'
import { ThemeProvider } from './theme-provider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
