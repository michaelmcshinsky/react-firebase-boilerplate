import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function Forbidden({ required = 'administrator' }: { required?: string }) {
  return (
    <div className="bg-card flex flex-col items-center gap-4 rounded-xl border px-6 py-16 text-center">
      <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-full">
        <ShieldAlert className="size-5" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold tracking-tight">Access restricted</h2>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          This page is only available to {required} accounts. Ask an administrator if you think you
          should have access.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link to="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  )
}
