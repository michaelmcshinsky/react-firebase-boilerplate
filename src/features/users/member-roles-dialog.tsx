import { AlertTriangle, Check, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/app/providers/auth-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getErrorMessage } from '@/lib/errors'
import { assignUserRoles, normalizeRoles } from '@/services/users'
import { ROLES, ROLE_META, type Role, type UserProfile } from '@/types'
import { cn } from '@/lib/utils'

interface MemberRolesDialogProps {
  member: UserProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberRolesDialog({ member, open, onOpenChange }: MemberRolesDialogProps) {
  const { user } = useAuth()
  const [selected, setSelected] = useState<Role[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const isSelf = member?.id === user?.uid

  useEffect(() => {
    if (!open || !member) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync form state when dialog opens
    setError(null)
    setSelected(normalizeRoles(member.roles))
  }, [open, member])

  function toggle(role: Role) {
    setError(null)
    setSelected((previous) => {
      if (previous.includes(role)) {
        if (previous.length === 1) {
          setError('A member needs at least one role.')
          return previous
        }
        return previous.filter((item) => item !== role)
      }
      return [...previous, role]
    })
  }

  async function save() {
    if (!member) return
    if (selected.length === 0) {
      setError('Choose at least one role.')
      return
    }
    if (isSelf && !selected.includes('admin')) {
      setError('You cannot remove your own admin role. Ask another admin to do it.')
      return
    }

    setPending(true)
    try {
      await assignUserRoles(member.id, selected)
      toast.success('Roles updated', {
        description: `${member.displayName || member.email} now has ${selected.join(', ')}.`,
      })
      onOpenChange(false)
    } catch (caught) {
      setError(getErrorMessage(caught))
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage roles</DialogTitle>
          <DialogDescription>
            Roles are written to Firebase custom claims by the <code>setUserRoles</code> Cloud
            Function, then mirrored to this profile document.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {ROLES.map((role) => {
            const checked = selected.includes(role)
            const locked = isSelf && role === 'admin'

            return (
              <button
                key={role}
                type="button"
                role="checkbox"
                aria-checked={checked}
                disabled={locked}
                onClick={() => toggle(role)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                  checked ? 'border-primary/40 bg-primary/5' : 'hover:bg-muted/50',
                  locked && 'cursor-not-allowed opacity-70',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border',
                    checked ? 'border-primary bg-primary text-primary-foreground' : 'border-input',
                  )}
                >
                  {checked ? <Check className="size-3" /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{ROLE_META[role].label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {ROLE_META[role].description}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {error ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/8 px-3 py-2 text-sm text-destructive"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={() => void save()} disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save roles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
