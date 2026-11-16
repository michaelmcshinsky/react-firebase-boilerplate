import { describe, expect, it } from 'vitest'

import {
  can,
  canEditPost,
  canManageContent,
  canManageMembers,
  hasRole,
  highestRole,
} from './permissions'

describe('hasRole', () => {
  it('matches a single role', () => {
    expect(hasRole(['editor'], 'editor')).toBe(true)
    expect(hasRole(['editor'], 'admin')).toBe(false)
  })

  it('matches any of several roles', () => {
    expect(hasRole(['user', 'editor'], ['admin', 'editor'])).toBe(true)
    expect(hasRole(['user'], ['admin', 'editor'])).toBe(false)
  })

  it('treats missing roles as no access', () => {
    expect(hasRole(undefined, 'admin')).toBe(false)
    expect(hasRole([], 'user')).toBe(false)
  })
})

describe('capabilities', () => {
  it('lets admins and editors manage content', () => {
    expect(canManageContent(['admin'])).toBe(true)
    expect(canManageContent(['editor'])).toBe(true)
    expect(canManageContent(['user'])).toBe(false)
  })

  it('limits member management to admins', () => {
    expect(canManageMembers(['admin'])).toBe(true)
    expect(canManageMembers(['editor'])).toBe(false)
  })

  it('allows the avatar capability only for the owner', () => {
    expect(can(['user'], 'avatar:upload', { userId: 'a', ownerId: 'a' })).toBe(true)
    expect(can(['user'], 'avatar:upload', { userId: 'a', ownerId: 'b' })).toBe(false)
  })
})

describe('canEditPost', () => {
  it('lets authors edit their own posts', () => {
    expect(canEditPost(['user'], 'author-1', { authorId: 'author-1' })).toBe(true)
  })

  it('blocks other members but not staff', () => {
    expect(canEditPost(['user'], 'author-2', { authorId: 'author-1' })).toBe(false)
    expect(canEditPost(['editor'], 'author-2', { authorId: 'author-1' })).toBe(true)
  })

  it('handles a signed-out viewer', () => {
    expect(canEditPost([], null, { authorId: 'author-1' })).toBe(false)
  })
})

describe('highestRole', () => {
  it('returns the most privileged role', () => {
    expect(highestRole(['user', 'admin'])).toBe('admin')
    expect(highestRole(['user', 'editor'])).toBe('editor')
    expect(highestRole(['user'])).toBe('user')
    expect(highestRole([])).toBeNull()
  })
})
