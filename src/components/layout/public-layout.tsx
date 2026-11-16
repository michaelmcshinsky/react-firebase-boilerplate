import { Link, Outlet } from 'react-router-dom'

import { useAuth } from '@/app/providers/auth-context'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

const FOOTER_LINKS = [
  {
    label: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Stack', href: '#stack' },
      { label: 'Getting started', href: '#start' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'README', href: 'https://github.com/michaelmcshinsky/react-firebase-boilerplate#readme' },
      { label: 'Firebase docs', href: 'https://firebase.google.com/docs' },
      { label: 'Security rules', href: 'https://firebase.google.com/docs/rules' },
      { label: 'Issues', href: 'https://github.com/michaelmcshinsky/react-firebase-boilerplate/issues' },
    ],
  },
]

export function PublicLayout() {
  const { status } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur-lg">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="rounded-md" aria-label="Home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Sections">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#stack" className="text-muted-foreground hover:text-foreground transition-colors">
              Stack
            </a>
            <a href="#start" className="text-muted-foreground hover:text-foreground transition-colors">
              Quick start
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            {status === 'authenticated' ? (
              <Button size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-3">
            <Logo />
            <p className="text-muted-foreground max-w-xs text-sm">
              An opinionated React + Firebase starting point: authentication, role-based access,
              typed Firestore CRUD and an admin dashboard that already looks finished.
            </p>
            <p className="text-muted-foreground text-xs">
              Built by{' '}
              <a
                className="hover:text-foreground underline underline-offset-4"
                href="https://github.com/michaelmcshinsky"
                target="_blank"
                rel="noreferrer"
              >
                Michael McShinsky
              </a>
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.label} className="space-y-3">
              <p className="text-xs font-semibold tracking-wider uppercase">{group.label}</p>
              <ul className="space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      {...(link.href.startsWith('http')
                        ? { target: '_blank', rel: 'noreferrer' }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t">
          <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>© {new Date().getFullYear()} React Firebase Boilerplate. MIT licensed.</p>
            <p>React 19 · TypeScript · Vite · Firebase</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
