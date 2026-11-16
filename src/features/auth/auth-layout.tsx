import { Check, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Logo } from '@/components/logo'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

const HIGHLIGHTS = [
  'Custom-claim roles enforced by security rules',
  'Typed Firestore models and streaming hooks',
  'Admin dashboard with tables, dialogs and toasts',
]

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1.05fr_1fr]">
      <div className="bg-sidebar relative hidden flex-col justify-between overflow-hidden border-r p-10 lg:flex">
        <div
          aria-hidden
          className="bg-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <div
          aria-hidden
          className="bg-primary/15 absolute -top-24 -left-16 size-72 rounded-full blur-3xl"
        />

        <Link to="/" className="relative">
          <Logo />
        </Link>

        <div className="relative max-w-md space-y-6">
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
            <Sparkles className="size-5" />
          </div>
          <blockquote className="text-2xl leading-snug font-medium tracking-tight text-balance">
            “The first day of a new project should be about the idea, not the sign-in form.”
          </blockquote>
          <ul className="space-y-2.5 text-sm">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="text-muted-foreground flex items-start gap-2">
                <span className="bg-success/15 text-success mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full">
                  <Check className="size-2.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-muted-foreground relative text-xs">
          React 19 · TypeScript · Firebase
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm space-y-7">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          {children}
          {footer ? <div className="text-muted-foreground text-sm">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}
