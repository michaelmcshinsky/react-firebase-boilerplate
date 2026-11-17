import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(),
  serverTimestamp: vi.fn(() => 'SERVER_TS'),
  callFunction: vi.fn(),
  query: vi.fn((...args: unknown[]) => args),
  orderBy: vi.fn((...args: unknown[]) => args),
  limit: vi.fn((...args: unknown[]) => args),
}))

vi.mock('firebase/firestore', () => ({
  getDoc: mocks.getDoc,
  setDoc: mocks.setDoc,
  updateDoc: mocks.updateDoc,
  deleteDoc: mocks.deleteDoc,
  onSnapshot: mocks.onSnapshot,
  serverTimestamp: mocks.serverTimestamp,
  query: mocks.query,
  orderBy: mocks.orderBy,
  limit: mocks.limit,
}))

vi.mock('@/lib/firebase/firestore', () => ({
  userDocument: (uid: string) => `users/${uid}`,
  usersCollection: () => 'users-collection',
  callFunction: mocks.callFunction,
}))

const {
  assignUserRoles,
  deleteMember,
  ensureProfile,
  normalizeRoles,
  setUserActive,
  splitDisplayName,
  updateProfileDocument,
} = await import('./users')

function snapshot(exists: boolean, data?: Record<string, unknown>) {
  return { exists: () => exists, data: () => data ?? {} }
}

const firebaseUser = {
  uid: 'user-1',
  email: 'ada@example.com',
  displayName: 'Ada Lovelace',
  photoURL: null,
}

describe('role helpers', () => {
  it('keeps only known roles', () => {
    expect(normalizeRoles(['admin', 'nope', 'user', 42])).toEqual(['admin', 'user'])
  })

  it('returns an empty list for malformed claims', () => {
    expect(normalizeRoles(undefined)).toEqual([])
    expect(normalizeRoles('admin')).toEqual([])
  })

  it('splits a display name into first and last', () => {
    expect(splitDisplayName('Ada Lovelace')).toEqual({ firstName: 'Ada', lastName: 'Lovelace' })
    expect(splitDisplayName('Prince')).toEqual({ firstName: 'Prince', lastName: '' })
  })
})

describe('ensureProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.setDoc.mockResolvedValue(undefined)
  })

  it('does not write when the profile already exists', async () => {
    mocks.getDoc.mockResolvedValue(snapshot(true, { id: 'user-1', roles: ['user'] }))

    const profile = await ensureProfile(firebaseUser)

    expect(profile).toMatchObject({ id: 'user-1', roles: ['user'] })
    expect(mocks.setDoc).not.toHaveBeenCalled()
  })

  it('creates a member profile with the least-privilege role', async () => {
    mocks.getDoc
      .mockResolvedValueOnce(snapshot(false))
      .mockResolvedValueOnce(snapshot(true, { id: 'user-1', roles: ['user'] }))

    await ensureProfile({ ...firebaseUser, displayName: null })

    expect(mocks.setDoc).toHaveBeenCalledWith(
      'users/user-1',
      expect.objectContaining({
        email: 'ada@example.com',
        displayName: 'ada',
        roles: ['user'],
        active: true,
        createdAt: 'SERVER_TS',
        updatedAt: 'SERVER_TS',
      }),
      { merge: true },
    )
  })
})

describe('profile writes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.updateDoc.mockResolvedValue(undefined)
    mocks.deleteDoc.mockResolvedValue(undefined)
    mocks.callFunction.mockResolvedValue({ ok: true })
  })

  it('stamps updatedAt on profile updates', async () => {
    await updateProfileDocument('user-1', { displayName: 'Ada' })

    expect(mocks.updateDoc).toHaveBeenCalledWith(
      'users/user-1',
      expect.objectContaining({ displayName: 'Ada', updatedAt: 'SERVER_TS' }),
    )
  })

  it('toggles the active flag', async () => {
    await setUserActive('user-1', false)

    expect(mocks.updateDoc).toHaveBeenCalledWith(
      'users/user-1',
      expect.objectContaining({ active: false, updatedAt: 'SERVER_TS' }),
    )
  })

  it('routes role changes through the callable, never a direct write', async () => {
    await assignUserRoles('user-2', ['editor'])

    expect(mocks.callFunction).toHaveBeenCalledWith('setUserRoles', {
      uid: 'user-2',
      roles: ['editor'],
    })
    expect(mocks.updateDoc).not.toHaveBeenCalled()
  })

  it('deletes accounts through the admin callable', async () => {
    await deleteMember('user-3')

    expect(mocks.callFunction).toHaveBeenCalledWith('deleteUser', { uid: 'user-3' })
  })
})
