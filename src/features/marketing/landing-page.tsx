import {
  ArrowRight,
  Check,
  CheckCheck,
  Copy,
  Database,
  FlaskConical,
  KeyRound,
  LayoutDashboard,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDocumentTitle } from '@/hooks/use-document-title'

const HERO_POINTS = [
  'Email/password and Google sign-in',
  'Role-based routes and UI',
  'Typed Firestore CRUD + rules',
]

const FEATURES = [
  {
    icon: KeyRound,
    title: 'Authentication that is done',
    body: 'Registration, sign-in, password reset, email verification, session persistence and a guest-aware public shell.',
  },
  {
    icon: ShieldCheck,
    title: 'Authorization with custom claims',
    body: 'Roles live in Firebase custom claims, mirrored to Firestore for the admin UI, and enforced again in security rules.',
  },
  {
    icon: Database,
    title: 'Typed data layer',
    body: 'Converters turn Firestore timestamps into Dates, services own every write, and hooks stream live collections into the UI.',
  },
  {
    icon: LayoutDashboard,
    title: 'Admin dashboard included',
    body: 'A polished shell with sortable, filterable, paginated tables, dialogs, toasts, empty states and optimistic feedback.',
  },
  {
    icon: Lock,
    title: 'Rules that deny',
    body: 'Least-privilege Firestore and Storage rules, with self-service profile updates and staff-only writes baked in.',
  },
  {
    icon: FlaskConical,
    title: 'Quality gates from day one',
    body: 'Vitest and Testing Library, Playwright smoke tests, strict TypeScript, ESLint, Prettier and a GitHub Actions pipeline.',
  },
]

const STACK = [
  {
    label: 'Frontend',
    items: ['React 19', 'TypeScript', 'Vite', 'React Router', 'Tailwind CSS 4', 'Radix / shadcn'],
  },
  {
    label: 'Firebase',
    items: [
      'Modular SDK',
      'Auth + custom claims',
      'Firestore',
      'Cloud Functions v2',
      'Storage',
      'Emulator Suite',
    ],
  },
  {
    label: 'Quality',
    items: ['Vitest', 'Testing Library', 'Playwright', 'ESLint', 'Prettier', 'GitHub Actions'],
  },
]

const QUICK_START = `git clone https://github.com/michaelmcshinsky/react-firebase-boilerplate.git
cd react-firebase-boilerplate
npm install
cp .env.example .env   # add your Firebase web config
npm run dev`

const FAQ = [
  {
    question: 'Do I need the Blaze plan?',
    answer:
      'Not to run the app. Auth, Firestore and Storage work on Spark. Cloud Functions (role management, seeding, account deletion) require Blaze, which is why the client has graceful fallbacks for local development.',
  },
  {
    question: 'Can I use the emulator suite?',
    answer:
      'Yes. Set VITE_USE_EMULATORS=true, run npm run emulators, then npm run seed to create an admin, an editor and a member with custom claims already applied.',
  },
  {
    question: 'How is authorization enforced?',
    answer:
      'Admin-only Cloud Functions set custom claims. The client reads those claims for routing and UI, and Firestore rules check the same claims server-side. The users document mirrors roles for display only.',
  },
  {
    question: 'Is this tied to Firebase Hosting?',
    answer:
      'No. The build is a static SPA, so it runs on Firebase Hosting, Netlify, Vercel or any static host. firebase.json is included because that is the default path.',
  },
]

export function LandingPage() {
  useDocumentTitle('React + Firebase starter')
  return (
    <>
      <Hero />
      <FeatureGrid />
      <DeveloperExperience />
      <StackSection />
      <QuickStart />
      <Questions />
      <FinalCta />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)] opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24">
        <div className="animate-fade-up space-y-7">
          <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1 text-xs">
            <Sparkles className="size-3 text-primary" />
            v2.0 · rebuilt on React 19 and the modular Firebase SDK
          </Badge>

          <div className="space-y-5">
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Ship the app,
              <br />
              not the <span className="text-gradient">auth plumbing</span>.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              A production-minded React + Firebase starter with authentication, role-based access,
              typed Firestore CRUD and an admin dashboard that already looks like a finished
              product.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link to="/register">
                Create an account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://github.com/michaelmcshinsky/react-firebase-boilerplate"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                View the source
              </a>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {HERO_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <Check className="size-4 text-success" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <AppPreview />
      </div>
    </section>
  )
}

function AppPreview() {
  const rows = [
    { title: 'Launch checklist', status: 'Published', tone: 'success' as const },
    { title: 'Design tokens v2', status: 'Draft', tone: 'secondary' as const },
    { title: 'Q4 release notes', status: 'Published', tone: 'success' as const },
  ]

  return (
    <div className="animate-fade-up relative [animation-delay:120ms] lg:pl-6">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/25 via-primary/10 to-transparent blur-2xl"
      />
      <div className="shadow-soft overflow-hidden rounded-2xl border bg-card">
        <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
          <span className="size-2 rounded-full bg-destructive/60" />
          <span className="size-2 rounded-full bg-warning/70" />
          <span className="size-2 rounded-full bg-success/70" />
          <span className="ml-2 truncate text-[11px] text-muted-foreground">
            app.yourproject.com/dashboard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[116px_1fr]">
          <div className="hidden flex-col gap-1 border-r bg-sidebar p-3 sm:flex">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/70 text-white">
                <Sparkles className="size-3" />
              </span>
              <span className="text-[11px] font-semibold">Northstar</span>
            </div>
            {['Dashboard', 'Posts', 'Products', 'Members'].map((item, index) => (
              <div
                key={item}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px]',
                  index === 0
                    ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                    : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'size-1 rounded-full',
                    index === 0 ? 'bg-primary' : 'bg-muted-foreground/40',
                  )}
                />
                {item}
              </div>
            ))}
          </div>

          <div className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[9px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Dashboard
                </p>
                <p className="text-sm font-semibold tracking-tight">Good morning, Mike</p>
              </div>
              <Badge variant="secondary" className="text-[9px]">
                Admin
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Posts', value: '24' },
                { label: 'Products', value: '12' },
                { label: 'Members', value: '8' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border bg-muted/40 p-2.5">
                  <p className="text-[9px] text-muted-foreground">{stat.label}</p>
                  <p className="text-base font-semibold tracking-tight">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-lg border">
              <div className="flex items-center justify-between border-b bg-muted/40 px-2.5 py-1.5">
                <span className="text-[9px] font-medium tracking-wider uppercase">
                  Recent posts
                </span>
                <span className="text-[9px] text-muted-foreground">Updated</span>
              </div>
              {rows.map((row) => (
                <div
                  key={row.title}
                  className="flex items-center justify-between gap-2 border-b px-2.5 py-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-4 items-center justify-center rounded bg-primary/10">
                      <span className="size-1.5 rounded-full bg-primary" />
                    </span>
                    <span className="text-[10px] font-medium">{row.title}</span>
                  </div>
                  <Badge variant={row.tone} className="text-[8px]">
                    {row.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shadow-soft absolute -bottom-4 -left-2 flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-[11px] sm:-left-6">
        <span className="flex size-5 items-center justify-center rounded-full bg-success/15 text-success">
          <ShieldCheck className="size-3" />
        </span>
        <div>
          <p className="font-medium">Custom claims verified</p>
          <p className="text-[11px] text-muted-foreground">admin · editor · member</p>
        </div>
      </div>
    </div>
  )
}

function FeatureGrid() {
  return (
    <section id="features" className="border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Included</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            The boring parts, already built
          </h2>
          <p className="text-muted-foreground">
            Every feature exists to be deleted or extended. Nothing is hidden behind a framework
            wrapper you have to learn first.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-4" />
              </div>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DeveloperExperience() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
        <div className="space-y-5">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Architecture
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Feature folders, one obvious place for every change
          </h2>
          <p className="text-muted-foreground">
            Firebase setup lives in <code className="text-xs text-foreground">lib/firebase</code>,
            writes live in <code className="text-xs text-foreground">services</code>, and each
            feature owns its page, table columns, form schema and mutations.
          </p>

          <ul className="space-y-3 text-sm">
            {[
              'Auth state and claims in one provider, consumed with useAuth()',
              'Reusable useCollection/useDocument hooks built on onSnapshot',
              'Zod schemas shared by React Hook Form and mutation payloads',
              'Role gates at route level and component level',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-2.5" />
                </span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <span className="font-mono text-xs text-muted-foreground">
              src/app/router/router.tsx
            </span>
            <span className="text-[11px] text-muted-foreground">excerpt</span>
          </div>
          <pre
            className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed"
            tabIndex={0}
            aria-label="Router excerpt"
          >
            <code>{`{/* admin-only route */}
{
  path: '/users',
  element: (
    <RequireRole roles={['admin']}>
      <UsersPage />
    </RequireRole>
  ),
}`}</code>
          </pre>
          <div className="flex items-center gap-2 border-t bg-muted/40 px-4 py-2.5 text-[11px]">
            <Lock className="size-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              The same roles are checked again in Firestore rules.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function StackSection() {
  return (
    <section id="stack">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">The stack</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Current, boring, and replaceable
          </h2>
          <p className="text-muted-foreground">
            Every dependency earns its place. No Redux, no component library lock-in, no legacy peer
            dependencies held together with patches.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STACK.map((group) => (
            <div key={group.label} className="rounded-xl border bg-card p-5">
              <p className="text-sm font-semibold">{group.label}</p>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-3.5 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuickStart() {
  return (
    <section id="start" className="border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-20">
        <div className="space-y-5">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Quick start
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Four commands to a running app
          </h2>
          <p className="text-muted-foreground">
            Copy your Firebase web config into <code className="text-xs text-foreground">.env</code>
            , start the dev server, and sign up. The first account is promoted with the seed script
            or the Firebase console.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a
                href="https://github.com/michaelmcshinsky/react-firebase-boilerplate#readme"
                target="_blank"
                rel="noreferrer"
              >
                Read the setup guide
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login">See the sign-in screen</Link>
            </Button>
          </div>
        </div>

        <CodeBlock code={QUICK_START} />
      </div>
    </section>
  )
}

function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Copied to clipboard')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not access the clipboard')
    }
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card shadow-sm', className)}>
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <span className="font-mono text-xs text-muted-foreground">terminal</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => void copy()}
          aria-label="Copy commands"
        >
          {copied ? <CheckCheck className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </div>
      <pre
        className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed"
        tabIndex={0}
        aria-label="Terminal commands"
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

function Questions() {
  return (
    <section id="faq" className="border-t bg-muted/30">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">FAQ</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Questions, answered</h2>
        </div>

        <div className="mt-8 divide-y rounded-xl border bg-card px-5">
          {FAQ.map((item) => (
            <details key={item.question} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
                {item.question}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 pr-8 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-primary/10 blur-3xl"
      />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-4 py-20 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Start with the parts you would have written anyway
        </h2>
        <p className="max-w-xl text-muted-foreground">
          Clone it, point it at a Firebase project, and spend your first day on the product instead
          of the login form.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/register">
              Create your account
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://github.com/michaelmcshinsky/react-firebase-boilerplate"
              target="_blank"
              rel="noreferrer"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Star on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
