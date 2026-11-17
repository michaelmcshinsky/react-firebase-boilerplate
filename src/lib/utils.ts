import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge conditional class names and de-duplicate conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Turn an arbitrary string into a URL-safe slug. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)
}

/** Initials for avatar fallbacks. */
export function initials(nameOrEmail: string) {
  const source = nameOrEmail.trim()
  if (!source) return '?'

  const [first, second] = source.includes('@')
    ? source.split('@')[0].split(/[._-]/)
    : source.split(/\s+/)

  return `${first?.[0] ?? ''}${second?.[0] ?? ''}`.toUpperCase() || source[0].toUpperCase()
}

/** Display helper that never renders an empty cell. */
export function dash(value: string | number | null | undefined) {
  return value === null || value === undefined || value === '' ? '—' : String(value)
}

export function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

/** "1 draft", "2 drafts" — keeps counts grammatical in UI copy. */
export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}
