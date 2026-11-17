import { useEffect } from 'react'

import { appName } from '@/app/config/env'

/** Keeps the browser tab title in sync with the current screen. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    if (!title) return
    document.title = `${title} · ${appName}`
  }, [title])
}
