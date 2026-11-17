import { Check, ExternalLink, Monitor, Moon, Sun, Terminal } from 'lucide-react'

import { appName, firebaseConfig, isFirebaseConfigured, useEmulators } from '@/app/config/env'
import { useAuth } from '@/app/providers/auth-context'
import { useTheme, type Theme } from '@/app/providers/theme-context'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ROLE_META } from '@/types'
import { highestRole } from '@/lib/permissions'

const THEMES: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { user, profile, roles, isAdmin } = useAuth()
  const role = highestRole(roles)

  const rows = [
    { label: 'App name', value: appName },
    { label: 'Firebase project', value: firebaseConfig.projectId || 'Not configured' },
    { label: 'Emulator suite', value: useEmulators ? 'Connected' : 'Off' },
    { label: 'Your role', value: role ? ROLE_META[role].label : 'Member' },
    { label: 'Email', value: user?.email ?? '—' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Appearance, environment details and where to go next."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              The theme is stored in localStorage and applied before first paint.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-3">
              {THEMES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    'relative flex flex-col items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                    theme === option.value ? 'border-primary/50 bg-primary/5' : 'hover:bg-muted/50',
                  )}
                  aria-pressed={theme === option.value}
                >
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-md border',
                      option.value === 'dark'
                        ? 'bg-zinc-900 text-zinc-100'
                        : option.value === 'light'
                          ? 'bg-white text-zinc-900'
                          : 'bg-gradient-to-r from-white to-zinc-900 text-zinc-500',
                    )}
                  >
                    <option.icon className="size-3.5" />
                  </span>
                  <span className="text-sm font-medium">{option.label}</span>
                  {theme === option.value ? (
                    <Check className="absolute top-3 right-3 size-3.5 text-primary" />
                  ) : null}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment</CardTitle>
            <CardDescription>Read from Vite environment variables.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="max-w-[60%] truncate font-medium">{row.value}</span>
                </div>
                <Separator className="mt-3 last:hidden" />
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant={isFirebaseConfigured ? 'success' : 'warning'}>
                {isFirebaseConfigured ? 'Firebase configured' : 'Firebase missing'}
              </Badge>
              <Badge variant={user?.emailVerified ? 'success' : 'outline'}>
                {user?.emailVerified ? 'Email verified' : 'Email unverified'}
              </Badge>
              {isAdmin ? <Badge variant="secondary">Admin tools enabled</Badge> : null}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
            <CardDescription>Where to make this starter yours.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="flex items-center gap-2 text-sm font-medium">
                <Terminal className="size-4" />
                Local emulator workflow
              </p>
              <pre className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                <code>{'npm run emulators\nnpm run seed\nnpm run dev'}</code>
              </pre>
            </div>
            <div className="space-y-2 rounded-lg border bg-muted/40 p-4">
              <p className="text-sm font-medium">Useful links</p>
              <ul className="space-y-1.5 text-sm">
                {[
                  {
                    label: 'Firebase console',
                    href: `https://console.firebase.google.com/project/${firebaseConfig.projectId || '_'}/overview`,
                  },
                  {
                    label: 'Security rules guide',
                    href: 'https://firebase.google.com/docs/rules',
                  },
                  {
                    label: 'Project README',
                    href: 'https://github.com/michaelmcshinsky/react-firebase-boilerplate#readme',
                  },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                      <ExternalLink className="size-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        Signed in as {profile?.displayName || user?.email || 'member'}.
      </p>
    </div>
  )
}
