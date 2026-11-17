import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ShieldCheck, Trash2, UserCheck, UserX, Users } from 'lucide-react'
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
import { UserAvatar } from '@/components/user-avatar'
import { useCollection } from '@/hooks/use-collection'
import { formatDate } from '@/lib/dates'
import { getErrorMessage } from '@/lib/errors'
import { highestRole } from '@/lib/permissions'
import { cn } from '@/lib/utils'
import { deleteMember, normalizeRoles, setUserActive, usersQuery } from '@/services/users'
import { ROLE_META, type UserProfile } from '@/types'

import { MemberRolesDialog } from './member-roles-dialog'

export function UsersPage() {
  const { user } = useAuth()
  const [editing, setEditing] = useState<UserProfile | null>(null)
  const [deleting, setDeleting] = useState<UserProfile | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const membersRef = useMemo(() => usersQuery(200), [])
  const { data, loading, error } = useCollection(membersRef)

  async function toggleActive(member: UserProfile) {
    setBusyId(member.id)
    try {
      await setUserActive(member.id, !member.active)
      toast.success(member.active ? 'Member deactivated' : 'Member reactivated')
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
      await deleteMember(deleting.id)
      toast.success('Member deleted', {
        description: 'The auth account and profile document were removed.',
      })
      setDeleting(null)
    } catch (caught) {
      toast.error(getErrorMessage(caught))
    } finally {
      setDeletePending(false)
    }
  }

  const columns: ColumnDef<UserProfile>[] = [
    {
      accessorKey: 'displayName',
      header: ({ column }) => <SortableHeader column={column}>Member</SortableHeader>,
      cell: ({ row }) => {
        const member = row.original
        return (
          <div className="flex items-center gap-3">
            <UserAvatar
              name={member.displayName}
              email={member.email}
              src={member.photoURL}
              className="size-8"
            />
            <div className="min-w-0">
              <p className="truncate font-medium">
                {member.displayName || member.email.split('@')[0]}
                {member.id === user?.uid ? (
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">(you)</span>
                ) : null}
              </p>
              <p className="truncate text-xs text-muted-foreground">{member.email}</p>
            </div>
          </div>
        )
      },
    },
    {
      id: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const roles = normalizeRoles(row.original.roles)
        const primary = highestRole(roles)

        return (
          <div className="flex flex-wrap items-center gap-1">
            {primary ? <Badge variant="default">{ROLE_META[primary].label}</Badge> : null}
            {roles
              .filter((role) => role !== primary)
              .map((role) => (
                <Badge key={role} variant="outline">
                  {ROLE_META[role].label}
                </Badge>
              ))}
          </div>
        )
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className="flex items-center gap-1.5 text-sm">
          <span
            className={cn(
              'size-1.5 rounded-full',
              row.original.active ? 'bg-success' : 'bg-muted-foreground/50',
            )}
          />
          {row.original.active ? 'Active' : 'Deactivated'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <SortableHeader column={column}>Joined</SortableHeader>,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span>
      ),
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const member = row.original
        const isSelf = member.id === user?.uid

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Actions for ${member.displayName || member.email}`}
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setEditing(member)}>
                  <ShieldCheck className="size-4" />
                  Manage roles
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isSelf || busyId === member.id}
                  onSelect={() => void toggleActive(member)}
                >
                  {member.active ? (
                    <>
                      <UserX className="size-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck className="size-4" />
                      Reactivate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  disabled={isSelf}
                  onSelect={() => setDeleting(member)}
                >
                  <Trash2 className="size-4" />
                  Delete member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Members"
        description="Search accounts, inspect roles and keep claims in sync. Deleted members lose their auth account entirely."
      />

      <div className="flex items-start gap-2.5 rounded-xl border bg-muted/40 px-4 py-3 text-sm">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          Role changes call the{' '}
          <code className="font-mono text-xs text-foreground">setUserRoles</code> Cloud Function.
          Deploy functions (or run the emulator) before editing roles — the client never writes
          claims directly.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        searchColumn="displayName"
        searchPlaceholder="Search members…"
        getRowId={(row) => row.id}
        pageSize={10}
        emptyTitle="No members found"
        emptyDescription="Accounts appear here as soon as they sign up."
        emptyAction={
          <Button size="sm" variant="outline" disabled>
            <Users className="size-4" />
            Invites coming soon
          </Button>
        }
      />

      <MemberRolesDialog
        member={editing}
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title="Delete member?"
        description={
          <>
            <span className="font-medium text-foreground">
              {deleting?.displayName || deleting?.email}
            </span>{' '}
            will lose access immediately. Their Firebase Auth account and profile document are
            deleted permanently.
          </>
        }
        confirmLabel="Delete member"
        destructive
        pending={deletePending}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  )
}
