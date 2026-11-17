import { describe, expect, it } from 'vitest'

import { cn, formatCurrency, initials, pluralize, slugify } from './utils'

describe('slugify', () => {
  it('produces url-safe slugs', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
    expect(slugify('  Café déjà vu  ')).toBe('cafe-deja-vu')
    expect(slugify('***')).toBe('')
  })

  it('caps length', () => {
    expect(slugify('a'.repeat(200))).toHaveLength(72)
  })
})

describe('initials', () => {
  it('uses names or the local part of an email', () => {
    expect(initials('Ada Lovelace')).toBe('AL')
    expect(initials('ada.lovelace@example.com')).toBe('AL')
    expect(initials('prince')).toBe('P')
    expect(initials('')).toBe('?')
  })
})

describe('formatCurrency', () => {
  it('hides cents for whole amounts by default', () => {
    expect(formatCurrency(1200)).toBe('$1,200')
    expect(formatCurrency(19.5)).toBe('$19.50')
  })
})

describe('cn', () => {
  it('merges conflicting tailwind classes', () => {
    expect(cn('px-2 text-sm', 'px-4')).toBe('text-sm px-4')
    const falsy = false
    expect(cn('hidden', falsy && 'block', undefined, 'flex')).toBe('flex')
  })
})

describe('pluralize', () => {
  it('uses the singular form for one', () => {
    expect(pluralize(1, 'draft')).toBe('1 draft')
    expect(pluralize(1, 'entry', 'entries')).toBe('1 entry')
  })

  it('uses the plural form for zero and more', () => {
    expect(pluralize(0, 'draft')).toBe('0 drafts')
    expect(pluralize(3, 'draft')).toBe('3 drafts')
    expect(pluralize(2, 'entry', 'entries')).toBe('2 entries')
  })
})
