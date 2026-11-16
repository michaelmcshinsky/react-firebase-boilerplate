import { describe, expect, it } from 'vitest'

import { formatDate, formatDateTime, formatIso, formatRelative } from './dates'

describe('formatDate', () => {
  it('returns em dash for null/undefined', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate(undefined)).toBe('—')
  })

  it('formats current year without year', () => {
    const now = new Date()
    const result = formatDate(now)
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/)
  })

  it('formats other years with year', () => {
    const date = new Date('2020-01-15T12:00:00Z')
    const result = formatDate(date)
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, 2020$/)
  })
})

describe('formatDateTime', () => {
  it('returns em dash for null/undefined', () => {
    expect(formatDateTime(null)).toBe('—')
    expect(formatDateTime(undefined)).toBe('—')
  })

  it('formats date with time', () => {
    const date = new Date('2026-03-04T14:30:00Z')
    const result = formatDateTime(date)
    // date-fns 'PP p' format: "Mar 4, 2026, 7:30 AM" (locale-dependent)
    expect(result).toMatch(/[A-Z][a-z]{2} \d{1,2}, \d{4}/)
    expect(result).toMatch(/\d{1,2}:\d{2} [AP]M/)
  })
})

describe('formatRelative', () => {
  it('returns Never for null/undefined', () => {
    expect(formatRelative(null)).toBe('Never')
    expect(formatRelative(undefined)).toBe('Never')
  })

  it('formats relative time', () => {
    const past = new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
    const result = formatRelative(past)
    expect(result).toMatch(/\d+ (hours?|minutes?) ago/)
  })
})

describe('formatIso', () => {
  it('returns empty string for null/undefined', () => {
    expect(formatIso(null)).toBe('')
    expect(formatIso(undefined)).toBe('')
  })

  it('formats as yyyy-MM-dd', () => {
    const date = new Date('2026-03-04T14:30:00Z')
    expect(formatIso(date)).toBe('2026-03-04')
  })
})
