import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Compass className="size-5" />
      </div>
      <div className="space-y-2">
        <p className="font-mono text-xs tracking-widest text-muted-foreground">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">This page moved on</h1>
        <p className="text-sm text-muted-foreground">
          The link is broken or the page was removed. The dashboard is still where you left it.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">
            <ArrowLeft className="size-4" />
            Back home
          </Link>
        </Button>
      </div>
    </div>
  )
}
