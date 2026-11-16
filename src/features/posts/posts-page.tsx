import type { ColumnDef } from '@tanstack/react-table'
import { FileText, MoreHorizontal, Pencil, Plus, Send, Trash2, Undo2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/app/providers/auth-context'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable, SortableHeader } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCollection } from '@/hooks/use-collection'
import { formatRelative } from '@/lib/dates'
import { getErrorMessage } from '@/lib/errors'
import { canEditPost, canManageContent } from '@/lib/permissions'
import { allPostsQuery, deletePost, postsByAuthorQuery, setPostStatus } from '@/services/posts'
import type { Post } from '@/types'

import { PostFormDialog } from './post-form-dialog'

type StatusFilter = 'all' | 'published' | 'draft'

export function PostsPage() {
  const { user, roles, isStaff } = useAuth()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState<Post | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const postsRef = useMemo(() => {
    if (!user) return null
    return isStaff ? allPostsQuery(200) : postsByAuthorQuery(user.uid, 200)
  }, [user, isStaff])

  const { data, loading, error } = useCollection(postsRef)

  const filtered = useMemo(
    () => (statusFilter === 'all' ? data : data.filter((post) => post.status === statusFilter)),
    [data, statusFilter],
  )

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(post: Post) {
    setEditing(post)
    setFormOpen(true)
  }

  async function toggleStatus(post: Post) {
    setBusyId(post.id)
    try {
      const next = post.status === 'published' ? 'draft' : 'published'
      await setPostStatus(post.id, next)
      toast.success(next === 'published' ? 'Post published' : 'Post moved to drafts')
    } catch (caught) {
      toast.error(getErrorMessage(caught))
    } finally {
      setBusyId(null)
    }
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletePending(true)
    try {
      await deletePost(deleting.id)
      toast.success('Post deleted')
      setDeleting(null)
    } catch (caught) {
      toast.error(getErrorMessage(caught))
    } finally {
      setDeletePending(false)
    }
  }

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => <SortableHeader column={column}>Post</SortableHeader>,
      cell: ({ row }) => (
        <div className="max-w-[26rem] min-w-0">
          <p className="truncate font-medium">{row.original.title}</p>
          <p className="text-muted-foreground truncate text-xs">
            {row.original.summary || 'No summary yet'}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'published' ? 'success' : 'outline'}>
          {row.original.status === 'published' ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      accessorKey: 'authorName',
      header: 'Author',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.original.authorName || '—'}</span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <SortableHeader column={column}>Updated</SortableHeader>,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{formatRelative(row.original.updatedAt)}</span>
      ),
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const post = row.original
        const editable = canEditPost(roles, user?.uid, post)

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${post.title}`}>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  disabled={!editable}
                  onSelect={() => {
                    openEdit(post)
                  }}
                >
                  <Pencil className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!editable || busyId === post.id}
                  onSelect={() => void toggleStatus(post)}
                >
                  {post.status === 'published' ? (
                    <>
                      <Undo2 className="size-4" />
                      Move to drafts
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Publish
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  disabled={!editable}
                  onSelect={() => setDeleting(post)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const canCreate = canManageContent(roles) || Boolean(user)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Posts"
        description={
          isStaff
            ? 'Every post in Firestore, with inline publishing and role-aware actions.'
            : 'Your drafts and published posts. Editors and admins can see everything.'
        }
        actions={
          canCreate ? (
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              New post
            </Button>
          ) : undefined
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        error={error}
        searchColumn="title"
        searchPlaceholder="Search posts…"
        getRowId={(row) => row.id}
        emptyTitle={statusFilter === 'all' ? 'No posts yet' : `No ${statusFilter} posts`}
        emptyDescription={
          statusFilter === 'all'
            ? 'Create a draft to see the table, dialogs and toasts in action.'
            : 'Try a different filter, or create something new.'
        }
        emptyAction={
          <Button size="sm" onClick={openCreate}>
            <FileText className="size-4" />
            New post
          </Button>
        }
        filters={
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
            <SelectTrigger size="sm" className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <PostFormDialog open={formOpen} onOpenChange={setFormOpen} post={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title="Delete post?"
        description={
          <>
            <span className="font-medium text-foreground">{deleting?.title}</span> will be removed
            permanently. This cannot be undone.
          </>
        }
        confirmLabel="Delete post"
        destructive
        pending={deletePending}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  )
}
