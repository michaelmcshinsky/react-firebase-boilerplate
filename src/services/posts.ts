import {
  addDoc,
  deleteDoc,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { postDocument, postsCollection } from '@/lib/firebase/firestore'
import { slugify } from '@/lib/utils'
import type { Post, PostStatus } from '@/types'

export interface PostInput {
  title: string
  summary: string
  body: string
  status: PostStatus
  tags: string[]
}

export function allPostsQuery(limitTo = 100) {
  return query(postsCollection(), orderBy('updatedAt', 'desc'), limit(limitTo))
}

export function postsByAuthorQuery(authorId: string, limitTo = 100) {
  return query(
    postsCollection(),
    where('authorId', '==', authorId),
    orderBy('updatedAt', 'desc'),
    limit(limitTo),
  )
}

export function publishedPostsQuery(limitTo = 3) {
  return query(
    postsCollection(),
    where('status', '==', 'published'),
    orderBy('updatedAt', 'desc'),
    limit(limitTo),
  )
}

export async function createPost(input: PostInput, author: { id: string; displayName: string }) {
  await addDoc(postsCollection(), {
    ...input,
    title: input.title.trim(),
    slug: slugify(input.title),
    authorId: author.id,
    authorName: author.displayName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as unknown as Post)
}

export async function updatePost(id: string, input: PostInput) {
  await updateDoc(postDocument(id), {
    ...input,
    title: input.title.trim(),
    slug: slugify(input.title),
    updatedAt: serverTimestamp(),
  } as unknown as Partial<Post>)
}

export async function setPostStatus(id: string, status: PostStatus) {
  await updateDoc(postDocument(id), {
    status,
    updatedAt: serverTimestamp(),
  } as unknown as Partial<Post>)
}

export async function deletePost(id: string) {
  await deleteDoc(postDocument(id))
}
