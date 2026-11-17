import { MailWarning, Menu, PanelLeft, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth } from '@/app/providers/auth-context'
import { Logo } from '@/components/logo'
import { SidebarNav } from '@/components/layout/sidebar-nav'
import { SkipLink } from '@/components/skip-link'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/layout/user-menu'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { resendVerificationEmail } from '@/lib/firebase/auth'
import { getErrorMessage } from '@/lib/errors'

export function AppShell() {
  const { user, profile, emailVerified, error } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [resending, setResending] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close mobile nav on route change
    setMobileOpen(false)
  }, [location.pathname])

  async function handleResend() {
    if (!user) return
    setResending(true)
    try {
      await resendVerificationEmail(user)
      toast.success('Verification email sent', {
        description: `Check the inbox for ${user.email ?? 'your account'}.`,
      })
    } catch (caught) {
      toast.error(getErrorMessage(caught))
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/25">
      <SkipLink />
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-sidebar lg:block">
        <SidebarNav />
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>

          <div className="flex items-center gap-2 text-sm lg:hidden">
            <Logo showName={false} />
            <span className="font-semibold">{profile?.displayName ?? 'Workspace'}</span>
          </div>

          <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
            <PanelLeft className="size-4" />
            <span>Workspace</span>
            <span className="text-border">/</span>
            <span className="font-medium text-foreground">{titleForPath(location.pathname)}</span>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/">View site</Link>
            </Button>
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            {error ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            {user && !emailVerified ? (
              <div className="flex flex-col gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm sm:flex-row sm:items-center">
                <MailWarning className="size-4 shrink-0" />
                <p className="flex-1">
                  Verify <span className="font-medium">{user.email}</span> to unlock account
                  recovery and invites.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleResend()}
                  disabled={resending}
                >
                  <RefreshCw className={resending ? 'size-3.5 animate-spin' : 'size-3.5'} />
                  Resend email
                </Button>
              </div>
            ) : null}

            <Outlet />
          </div>
        </main>
      </div>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent
          showCloseButton={false}
          className="inset-y-0 top-0 left-0 h-full w-72 max-w-[85%] translate-x-0 translate-y-0 rounded-none border-r p-0"
        >
          <DialogTitle className="sr-only">Navigation</DialogTitle>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function titleForPath(pathname: string) {
  if (pathname.startsWith('/dashboard')) return 'Dashboard'
  if (pathname.startsWith('/posts')) return 'Posts'
  if (pathname.startsWith('/products')) return 'Products'
  if (pathname.startsWith('/users')) return 'Members'
  if (pathname.startsWith('/settings')) return 'Settings'
  if (pathname.startsWith('/account')) return 'Profile'
  return 'Workspace'
}
