import type { Post, Product, Role } from '@/types'

/** True when the member holds at least one of the required roles. */
export function hasRole(
  roles: readonly string[] | null | undefined,
  required: Role | readonly Role[],
): boolean {
  if (!roles || roles.length === 0) return false
  const wanted = typeof required === 'string' ? [required] : required
  return wanted.some((role) => roles.includes(role))
}

/** Admins and editors can manage every piece of content. */
export function canManageContent(roles: readonly Role[] | null | undefined) {
  return hasRole(roles, ['admin', 'editor'])
}

/** Only admins manage members and role assignments. */
export function canManageMembers(roles: readonly Role[] | null | undefined) {
  return hasRole(roles, 'admin')
}

export function canEditPost(
  roles: readonly Role[] | null | undefined,
  userId: string | null | undefined,
  post: Pick<Post, 'authorId'>,
) {
  return canManageContent(roles) || (Boolean(userId) && post.authorId === userId)
}

export function canEditProduct(roles: readonly Role[] | null | undefined) {
  return canManageContent(roles)
}

export function canUploadAvatar(userId: string | null | undefined, uid: string) {
  return Boolean(userId) && userId === uid
}

/** The most privileged role, used for the profile badge. */
export function highestRole(roles: readonly Role[] | null | undefined): Role | null {
  const order: Role[] = ['admin', 'editor', 'user']
  return order.find((role) => roles?.includes(role)) ?? null
}

export type Capability = 'content:manage' | 'members:manage' | 'avatar:upload'

export function can(
  roles: readonly Role[] | null | undefined,
  capability: Capability,
  context?: { userId?: string | null; ownerId?: string },
) {
  switch (capability) {
    case 'content:manage':
      return canManageContent(roles)
    case 'members:manage':
      return canManageMembers(roles)
    case 'avatar:upload':
      return Boolean(context?.userId && context.ownerId && context.userId === context.ownerId)
    default:
      return false
  }
}

export const productIsPublic = (product: Pick<Product, 'visibility'>) =>
  product.visibility === 'public'
