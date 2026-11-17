import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { useDocumentTitle } from './use-document-title'

describe('useDocumentTitle', () => {
  afterEach(() => {
    document.title = ''
  })

  it('prefixes the page title with the app name', () => {
    renderHook(() => useDocumentTitle('Dashboard'))

    expect(document.title).toBe('Dashboard · Northstar')
  })

  it('updates when the title changes', () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'Posts' },
    })

    expect(document.title).toBe('Posts · Northstar')

    rerender({ title: 'Members' })

    expect(document.title).toBe('Members · Northstar')
  })

  it('leaves the title alone when none is provided', () => {
    document.title = 'Existing'

    renderHook(() => useDocumentTitle(undefined))

    expect(document.title).toBe('Existing')
  })
})
