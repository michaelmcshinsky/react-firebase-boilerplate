export const ROLES = ['admin', 'editor', 'user'] as const

export type Role = (typeof ROLES)[number]

export const ROLE_META: Record<Role, { label: string; description: string }> = {
  admin: {
    label: 'Admin',
    description: 'Full access: manages members, roles, content and settings.',
  },
  editor: {
    label: 'Editor',
    description: 'Can publish content and manage every post and product.',
  },
  user: {
    label: 'Member',
    description: 'Signed-in member. Manages their own profile and drafts.',
  },
}

export interface UserProfile {
  id: string
  email: string
  displayName: string
  firstName: string
  lastName: string
  photoURL: string | null
  roles: Role[]
  active: boolean
  createdAt: Date | null
  updatedAt: Date | null
  lastLoginAt: Date | null
}

export interface RoleDocument {
  id: Role
  displayName: string
  description: string
  system: boolean
}

export const POST_STATUSES = ['draft', 'published'] as const

export type PostStatus = (typeof POST_STATUSES)[number]

export interface Post {
  id: string
  title: string
  slug: string
  summary: string
  body: string
  status: PostStatus
  tags: string[]
  authorId: string
  authorName: string
  createdAt: Date | null
  updatedAt: Date | null
}

export const PRODUCT_VISIBILITIES = ['public', 'private'] as const

export type ProductVisibility = (typeof PRODUCT_VISIBILITIES)[number]

export interface Product {
  id: string
  name: string
  sku: string
  description: string
  price: number
  visibility: ProductVisibility
  createdAt: Date | null
  updatedAt: Date | null
}

export interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: Date | null
  kind: 'post' | 'product' | 'member'
}
