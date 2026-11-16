import {
  ArrowRight,
  CheckCircle2,
  Circle,
  FileText,
  Package,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '@/app/providers/auth-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCollection } from '@/hooks/use-collection'
import { formatRelative } from '@/lib/dates'
import { cn } from '@/lib/utils'
import { allPostsQuery, postsByAuthorQuery } from '@/services/posts'
import { allProductsQuery } from '@/services/products'
import { usersQuery } from '@/services/users'
import type { Role } from '@/types'

export function DashboardPage() {
  const { user, profile, roles, isAdmin, isStaff, emailVerified } = useAuth()

  const postsRef = useMemo(() => {
    if (!user) return null
    return isStaff ? allPostsQuery(50) : postsByAuthorQuery(user.uid, 50)
  }, [user, isStaff])

  const productsRef = useMemo(() => (isStaff ? allProductsQuery(20) : null), [isStaff])
  const membersRef = useMemo(() => (isAdmin ? usersQuery(20) : null), [isAdmin])

  const posts = useCollection(postsRef)
  const products = useCollection(productsRef)
  const members = useCollection(membersRef)

  const published = posts.data.filter((post) => post.status === 'published').length
  const drafts = posts.data.filter((post) => post.status === 'draft').length
  const displayName = profile?.displayName || user?.displayName || 'there'

  const checklist = [
    {
      label: 'Complete your profile',
      description: 'Add your name so teammates recognise you.',
      done: Boolean(profile?.firstName && profile?.lastName),
      to: '/account',
    },
    {
      label: 'Verify your email',
      description: 'Unlocks password recovery and invites.',
      done: emailVerified,
      to: '/account',
    },
    {
      label: 'Create your first post',
      description: 'Publish something, or keep it as a draft.',
      done: posts.data.length > 0,
      to: '/posts',
    },
    {
      label: isAdmin ? 'Invite a teammate' : 'Explore the workspace',
      description: isAdmin
        ? 'Promote an account to editor from the members page.'
        : 'See how products and tables are wired up.',
      done: isAdmin ? members.data.length > 1 : false,
      to: isAdmin ? '/users' : '/products',
    },
  ]

  const completed = checklist.filter((item) => item.done).length
  const activity = [
    ...posts.data.slice(0, 4).map((post) => ({
      id: `post-${post.id}`,
      label: post.title,
      meta: `${post.status === 'published' ? 'Published' : 'Draft'} post`,
      date: post.updatedAt,
      icon: FileText,
    })),
    ...products.data.slice(0, 2).map((product) => ({
      id: `product-${product.id}`,
      label: product.name,
      meta: 'Product updated',
      date: product.updatedAt,
      icon: Package,
    })),
  ]
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Overview</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Good to see you, {displayName.split(' ')[0]}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? 'You have full access to members, content and settings.'
              : isStaff
                ? 'You can manage every post and product in the workspace.'
                : 'Write drafts, manage your profile and browse the workspace.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/posts">
              <FileText className="size-4" />
              New post
            </Link>
          </Button>
          {isAdmin ? (
            <Button variant="outline" asChild>
              <Link to="/users">
                <Users className="size-4" />
                Members
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Posts"
          value={posts.loading ? null : posts.data.length}
          detail={`${published} published · ${drafts} drafts`}
        />
        <StatCard
          icon={Package}
          label="Products"
          value={isStaff ? (products.loading ? null : products.data.length) : '—'}
          detail={isStaff ? 'Catalog items in Firestore' : 'Editors and admins only'}
        />
        <StatCard
          icon={Users}
          label="Members"
          value={isAdmin ? (members.loading ? null : members.data.length) : '—'}
          detail={isAdmin ? 'Accounts with a profile' : 'Admins only'}
        />
        <StatCard
          icon={ShieldCheck}
          label="Your access"
          value={roleLabel(roles)}
          detail={emailVerified ? 'Email verified' : 'Email not verified'}
          badge
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Recent posts</CardTitle>
              <CardDescription>The last five documents in Firestore.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/posts">
                Manage
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {posts.loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-11 w-full" />
                ))}
              </div>
            ) : posts.error ? (
              <p className="text-sm text-destructive">{posts.error}</p>
            ) : posts.data.length === 0 ? (
              <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed px-4 py-8">
                <p className="text-sm font-medium">No posts yet</p>
                <p className="text-sm text-muted-foreground">
                  Create a draft to see the table, dialogs and toasts in action.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/posts">Create a post</Link>
                </Button>
              </div>
            ) : (
              <ul className="-mx-2 divide-y">
                {posts.data.slice(0, 5).map((post) => (
                  <li key={post.id} className="flex items-center gap-3 px-2 py-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <FileText className="size-3.5 text-muted-foreground" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{post.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {post.authorName || 'Unknown author'} · {formatRelative(post.updatedAt)}
                      </p>
                    </div>
                    <Badge variant={post.status === 'published' ? 'success' : 'outline'}>
                      {post.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Getting started</CardTitle>
                <span className="text-xs text-muted-foreground">
                  {completed}/{checklist.length}
                </span>
              </div>
              <CardDescription>Four steps to a fully wired workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {checklist.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="-mx-2 flex items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50"
                >
                  {item.done ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                  ) : (
                    <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
                  )}
                  <span className="min-w-0">
                    <span
                      className={cn(
                        'block text-sm font-medium',
                        item.done && 'line-through opacity-60',
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="block text-xs text-muted-foreground">{item.description}</span>
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Latest activity</CardTitle>
              <CardDescription>Write-through Firestore listeners keep this live.</CardDescription>
            </CardHeader>
            <CardContent>
              {activity.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing has changed yet.</p>
              ) : (
                <ul className="space-y-3">
                  {activity.map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-muted">
                        <item.icon className="size-3 text-muted-foreground" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.meta} · {formatRelative(item.date)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 sm:flex-row sm:items-center">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="size-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Everything on this page is a pattern to copy</p>
          <p className="text-sm text-muted-foreground">
            Live collections, role-gated UI, skeleton and empty states, and a responsive shell.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://github.com/michaelmcshinsky/react-firebase-boilerplate#readme"
            target="_blank"
            rel="noreferrer"
          >
            Read the docs
          </a>
        </Button>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  badge = false,
}: {
  icon: LucideIcon
  label: string
  value: number | string | null
  detail: string
  badge?: boolean
}) {
  return (
    <Card className="gap-0 py-4">
      <CardContent className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </span>
          <Icon className="size-4 text-muted-foreground/70" />
        </div>
        {value === null ? (
          <Skeleton className="h-7 w-16" />
        ) : badge && typeof value === 'string' ? (
          <div>
            <Badge variant="secondary" className="text-sm">
              {value}
            </Badge>
          </div>
        ) : (
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        )}
        <p className="truncate text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function roleLabel(roles: Role[]) {
  if (roles.includes('admin')) return 'Admin'
  if (roles.includes('editor')) return 'Editor'
  return 'Member'
}
