import { format, formatDistanceToNowStrict, isSameYear } from 'date-fns'

/** Human readable date, e.g. "Mar 4, 2026". */
export function formatDate(value: Date | null | undefined) {
  if (!value) return '—'
  return isSameYear(value, new Date()) ? format(value, 'MMM d') : format(value, 'MMM d, yyyy')
}

/** Full timestamp for detail views. */
export function formatDateTime(value: Date | null | undefined) {
  if (!value) return '—'
  return format(value, 'PP p')
}

/** Relative time, e.g. "3 days ago". */
export function formatRelative(value: Date | null | undefined) {
  if (!value) return 'Never'
  return `${formatDistanceToNowStrict(value)} ago`
}

/** Search-friendly ISO day. */
export function formatIso(value: Date | null | undefined) {
  if (!value) return ''
  return format(value, 'yyyy-MM-dd')
}
