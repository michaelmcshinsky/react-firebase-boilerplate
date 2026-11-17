import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'SERVER_TS'),
  query: vi.fn((...args: unknown[]) => args),
  where: vi.fn((...args: unknown[]) => args),
  orderBy: vi.fn((...args: unknown[]) => args),
  limit: vi.fn((...args: unknown[]) => args),
}))

vi.mock('firebase/firestore', () => ({
  addDoc: mocks.addDoc,
  updateDoc: mocks.updateDoc,
  deleteDoc: mocks.deleteDoc,
  serverTimestamp: mocks.serverTimestamp,
  query: mocks.query,
  where: mocks.where,
  orderBy: mocks.orderBy,
  limit: mocks.limit,
}))

vi.mock('@/lib/firebase/firestore', () => ({
  postsCollection: () => 'posts-collection',
  postDocument: (id: string) => `posts/${id}`,
}))

const { createPost, deletePost, setPostStatus, updatePost } = await import('./posts')

const input = {
  title: '  Hello World  ',
  summary: 'A summary',
  body: 'A body',
  status: 'draft' as const,
  tags: ['release'],
}

describe('posts service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.addDoc.mockResolvedValue({ id: 'new-post' })
    mocks.updateDoc.mockResolvedValue(undefined)
    mocks.deleteDoc.mockResolvedValue(undefined)
  })

  it('normalises the payload when creating a post', async () => {
    await createPost(input, { id: 'user-1', displayName: 'Ada Admin' })

    expect(mocks.addDoc).toHaveBeenCalledWith(
      'posts-collection',
      expect.objectContaining({
        title: 'Hello World',
        slug: 'hello-world',
        authorId: 'user-1',
        authorName: 'Ada Admin',
        status: 'draft',
        tags: ['release'],
        createdAt: 'SERVER_TS',
        updatedAt: 'SERVER_TS',
      }),
    )
  })

  it('re-slugs and timestamps an update', async () => {
    await updatePost('post-1', { ...input, title: 'Renamed Post' })

    expect(mocks.updateDoc).toHaveBeenCalledWith(
      'posts/post-1',
      expect.objectContaining({
        title: 'Renamed Post',
        slug: 'renamed-post',
        updatedAt: 'SERVER_TS',
      }),
    )
  })

  it('only changes status when publishing', async () => {
    await setPostStatus('post-1', 'published')

    expect(mocks.updateDoc).toHaveBeenCalledWith(
      'posts/post-1',
      expect.objectContaining({ status: 'published', updatedAt: 'SERVER_TS' }),
    )
    const payload = mocks.updateDoc.mock.calls[0][1] as Record<string, unknown>
    expect(payload).not.toHaveProperty('title')
  })

  it('deletes by document reference', async () => {
    await deletePost('post-9')

    expect(mocks.deleteDoc).toHaveBeenCalledWith('posts/post-9')
  })

  it('surfaces Firestore failures to the caller', async () => {
    mocks.addDoc.mockRejectedValueOnce(new Error('permission-denied'))

    await expect(createPost(input, { id: 'user-1', displayName: 'Ada' })).rejects.toThrow(
      'permission-denied',
    )
  })
})
