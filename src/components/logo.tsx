import { Sparkles } from 'lucide-react'

import { appName } from '@/app/config/env'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showName?: boolean
  name?: string
}

export function Logo({ className, showName = true, name = appName }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span className="from-primary to-primary/70 ring-primary/20 flex size-8 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm ring-1">
        <Sparkles className="size-4" aria-hidden />
      </span>
      {showName ? (
        <span className="text-sm font-semibold tracking-tight">{name}</span>
      ) : null}
    </span>
  )
}
