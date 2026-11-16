import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore'

const DEFAULT_DATE_FIELDS = ['createdAt', 'updatedAt', 'lastLoginAt'] as const

/**
 * Firestore stores dates as `Timestamp`. The app works with real `Date`
 * objects, so converters translate in both directions and drop `undefined`
 * values (Firestore rejects them).
 */
export function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    const timestamp = value as { toDate: () => Date }
    return timestamp.toDate()
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

export function createConverter<T extends { id: string }>(config?: {
  dateFields?: readonly string[]
}): FirestoreDataConverter<T> {
  const dateFields = new Set(config?.dateFields ?? DEFAULT_DATE_FIELDS)

  return {
    toFirestore(model: WithFieldValue<T>): DocumentData {
      const { id: _id, ...data } = model as unknown as Record<string, unknown>
      return Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      ) as DocumentData
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): T {
      const data = snapshot.data(options) as Record<string, unknown>
      for (const field of dateFields) {
        if (field in data) data[field] = toDate(data[field])
      }
      return { ...data, id: snapshot.id } as T
    },
  }
}
