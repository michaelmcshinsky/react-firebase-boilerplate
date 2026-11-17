import { AlertOctagon, RefreshCw } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'

import { isProduction } from '@/app/config/env'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Catches render and effect errors so a single broken screen never blanks the
 * whole app. A provider crash (for example a misconfigured Firebase project)
 * shows the recovery panel instead of an empty document.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Swap this for your error reporter (Sentry, Crashlytics, …).
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  private reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    const { children, fallback } = this.props

    if (!error) return children
    if (fallback) return fallback(error, this.reset)

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertOctagon className="size-5" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-lg font-semibold tracking-tight">Something broke on this screen</h1>
            <p className="text-sm text-muted-foreground">
              The rest of the app is still running. Reload to recover, and check the browser console
              if it keeps happening.
            </p>
          </div>
          {!isProduction ? (
            <pre className="max-h-40 overflow-auto rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap">
              {error.message}
            </pre>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="size-4" />
              Reload
            </Button>
            <Button variant="outline" onClick={this.reset}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
