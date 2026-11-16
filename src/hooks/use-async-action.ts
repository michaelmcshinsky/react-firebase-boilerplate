import { useCallback, useEffect, useRef, useState } from 'react'

import { getErrorMessage } from '@/lib/errors'

/** Runs an async action with pending state and a normalized error message. */
export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const actionRef = useRef(action)

  useEffect(() => {
    actionRef.current = action
  }, [action])

  const run = useCallback(async (...args: TArgs): Promise<TResult | undefined> => {
    setPending(true)
    setError(null)
    try {
      return await actionRef.current(...args)
    } catch (caught) {
      setError(getErrorMessage(caught))
      return undefined
    } finally {
      setPending(false)
    }
  }, [])

  return { pending, error, run, resetError: () => setError(null) }
}

/** Debounces a fast-changing value (search inputs, filters). */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debounced
}
