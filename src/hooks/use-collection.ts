import { useEffect, useRef, useState } from 'react'
import { onSnapshot, type DocumentReference, type Query } from 'firebase/firestore'

import { getErrorMessage } from '@/lib/errors'

export interface CollectionState<T> {
  data: T[]
  loading: boolean
  error: string | null
}

/**
 * Subscribes to a Firestore query and keeps the result in state.
 *
 * Memoize the query (useMemo) so the subscription is not recreated on every
 * render. Passing `null` renders an empty, non-loading state, which is handy
 * while waiting for auth.
 */
export function useCollection<T>(queryRef: Query<T> | null): CollectionState<T> {
  const [state, setState] = useState<CollectionState<T>>({
    data: [],
    loading: Boolean(queryRef),
    error: null,
  })
  const previousQueryRef = useRef<Query<T> | null>(queryRef)

  useEffect(() => {
    if (!queryRef) return

    const queryChanged = previousQueryRef.current !== queryRef
    if (queryChanged) {
      setState((previous) => ({ ...previous, loading: true, error: null }))
    }
    previousQueryRef.current = queryRef

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        setState({
          data: snapshot.docs.map((document) => document.data()),
          loading: false,
          error: null,
        })
      },
      (error) => {
        setState({ data: [], loading: false, error: getErrorMessage(error) })
      },
    )

    return unsubscribe
  }, [queryRef])

  return state
}

export interface DocumentState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useDocument<T>(reference: DocumentReference<T> | null): DocumentState<T> {
  const [state, setState] = useState<DocumentState<T>>({
    data: null,
    loading: Boolean(reference),
    error: null,
  })
  const previousReference = useRef<DocumentReference<T> | null>(reference)

  useEffect(() => {
    if (!reference) return

    const referenceChanged = previousReference.current !== reference
    if (referenceChanged) {
      setState((previous) => ({ ...previous, loading: true, error: null }))
    }
    previousReference.current = reference

    const unsubscribe = onSnapshot(
      reference,
      (snapshot) => {
        setState({ data: snapshot.exists() ? snapshot.data() : null, loading: false, error: null })
      },
      (error) => setState({ data: null, loading: false, error: getErrorMessage(error) }),
    )

    return unsubscribe
  }, [reference])

  return state
}
