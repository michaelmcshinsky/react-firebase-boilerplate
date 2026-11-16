import { Database, KeyRound, Terminal } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'

const STEPS = [
  {
    icon: KeyRound,
    title: 'Add your web credentials',
    body: 'Copy .env.example to .env and paste the config from Firebase console → Project settings → Your apps.',
  },
  {
    icon: Database,
    title: 'Enable Auth and Firestore',
    body: 'Turn on Email/Password (and Google if you want it), then create a Firestore database in production mode.',
  },
  {
    icon: Terminal,
    title: 'Push the rules and restart',
    body: 'Run npm run dev again. Rules and indexes live in firestore.rules and firestore.indexes.json — deploy them with firebase deploy --only firestore.',
  },
]

export function ConfigurationRequired() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-8 px-4 py-16 sm:px-6">
      <div className="space-y-4">
        <Logo />
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            One step left
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Connect your Firebase project</h1>
          <p className="text-muted-foreground">
            The app is running, but authentication and Firestore need credentials before they can
            work. Configuration is read from environment variables at build time.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {STEPS.map((step) => (
          <div key={step.title} className="flex gap-4 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <step.icon className="size-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-muted/60 p-4 font-mono text-xs leading-relaxed">
        <p className="text-muted-foreground"># .env</p>
        <p>VITE_FIREBASE_API_KEY=…</p>
        <p>VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com</p>
        <p>VITE_FIREBASE_PROJECT_ID=your-project</p>
        <p>VITE_FIREBASE_APP_ID=…</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/">Back to the site</Link>
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://github.com/michaelmcshinsky/react-firebase-boilerplate#readme"
            target="_blank"
            rel="noreferrer"
          >
            Read the setup guide
          </a>
        </Button>
      </div>
    </div>
  )
}
