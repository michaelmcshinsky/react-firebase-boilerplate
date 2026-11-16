import type { QueryDocumentSnapshot } from 'firebase/firestore'
import { describe, expect, it } from 'vitest'

import { createConverter, toDate } from './converters'

describe('toDate', () => {
  it('handles null and empty values', () => {
    expect(toDate(null)).toBeNull()
    expect(toDate(undefined)).toBeNull()
  })

  it('passes Dates through', () => {
    const date = new Date('2026-01-02T03:04:05Z')
    expect(toDate(date)).toBe(date)
  })

  it('converts Firestore-like timestamps', () => {
    const date = new Date('2026-05-06T07:08:09Z')
    expect(toDate({ toDate: () => date })).toBe(date)
  })

  it('parses strings and rejects gibberish', () => {
    expect(toDate('2026-05-06')?.getUTCFullYear()).toBe(2026)
    expect(toDate('not-a-date')).toBeNull()
    expect(toDate(12)).toBeInstanceOf(Date)
  })
})

describe('createConverter', () => {
  const converter = createConverter<{ id: string; title: string; createdAt: Date | null }>()

  it('converts timestamps and injects the document id', () => {
    const date = new Date('2026-02-03T00:00:00Z')
    const snapshot = {
      id: 'post-1',
      data: () => ({ title: 'Hello', createdAt: { toDate: () => date } }),
    } as unknown as QueryDocumentSnapshot

    expect(converter.fromFirestore(snapshot)).toEqual({
      id: 'post-1',
      title: 'Hello',
      createdAt: date,
    })
  })

  it('drops the id and undefined values when writing', () => {
    const data = converter.toFirestore({
      id: 'post-1',
      title: 'Hello',
      createdAt: undefined,
    } as never)

    expect(data).toEqual({ title: 'Hello' })
  })
})
