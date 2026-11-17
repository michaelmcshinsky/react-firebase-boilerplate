import { getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

if (getApps().length === 0) {
  initializeApp()
}

export const db = getFirestore()
export const auth = getAuth()

export const ROLES = ['admin', 'editor', 'user'] as const

export type Role = (typeof ROLES)[number]

export function isRoleArray(value: unknown): value is Role[] {
  return (
    Array.isArray(value) && value.length > 0 && value.every((role) => ROLES.includes(role as Role))
  )
}

export function callerIsAdmin(token: Record<string, unknown> | undefined): boolean {
  const roles = token?.roles
  return Array.isArray(roles) && roles.includes('admin')
}
