import { AlertCircle, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { isFirebaseConfigured } from '@/app/config/env'

export function FormError({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/8 px-3 py-2.5 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  )
}

export function SubmitSpinner({ pending, label }: { pending: boolean; label: string }) {
  return (
    <>
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {label}
    </>
  )
}

export function ConfigNotice() {
  if (isFirebaseConfigured) return null

  return (
    <div className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2.5 text-xs leading-relaxed">
      <span className="font-medium">Firebase is not configured.</span> Add your web app credentials
      to <code className="font-mono">.env</code> and restart the dev server. See{' '}
      <code className="font-mono">README.md</code> for the exact variables.
    </div>
  )
}
