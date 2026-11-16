import { Loader2 } from 'lucide-react'

export function FullPageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Loader2 className="text-muted-foreground size-5 animate-spin" />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  )
}
