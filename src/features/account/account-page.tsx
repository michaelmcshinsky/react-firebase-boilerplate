import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Loader2, MailCheck, ShieldCheck } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuth } from '@/app/providers/auth-context'
import { FormField } from '@/components/forms/form-field'
import { PageHeader } from '@/components/page-header'
import { UserAvatar } from '@/components/user-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { changePassword, resendVerificationEmail, updateAccountProfile } from '@/lib/firebase/auth'
import { uploadAvatar, validateAvatar } from '@/lib/firebase/storage'
import { getErrorMessage } from '@/lib/errors'
import { updateProfileDocument } from '@/services/users'
import { ROLE_META } from '@/types'
import { highestRole } from '@/lib/permissions'

import {
  passwordChangeSchema,
  profileSchema,
  type PasswordChangeValues,
  type ProfileValues,
} from '@/features/auth/schemas'

export function AccountPage() {
  const { user, profile, roles, refresh, hasRole } = useAuth()
  const [avatarPending, setAvatarPending] = useState(false)
  const [resendPending, setResendPending] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const role = highestRole(roles)

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      displayName: profile?.displayName ?? '',
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
    },
  })

  const passwordForm = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const hasPasswordProvider = user?.providerData.some(
    (provider) => provider.providerId === 'password',
  )

  async function saveProfile(values: ProfileValues) {
    if (!user) return
    try {
      await updateProfileDocument(user.uid, values)
      await updateAccountProfile({ displayName: values.displayName })
      toast.success('Profile saved')
      await refresh()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  async function handleAvatar(file: File | undefined) {
    if (!file || !user) return
    const problem = validateAvatar(file)
    if (problem) {
      toast.error(problem)
      return
    }

    setAvatarPending(true)
    try {
      const { url } = await uploadAvatar(user.uid, file)
      await updateProfileDocument(user.uid, { photoURL: url })
      await updateAccountProfile({ photoURL: url })
      await refresh()
      toast.success('Photo updated')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setAvatarPending(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  async function resendVerification() {
    if (!user) return
    setResendPending(true)
    try {
      await resendVerificationEmail(user)
      toast.success('Verification email sent')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setResendPending(false)
    }
  }

  async function savePassword(values: PasswordChangeValues) {
    if (!user) return
    try {
      await changePassword(user, values.currentPassword, values.newPassword)
      passwordForm.reset()
      toast.success('Password updated')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Everything here writes through the same services the rest of the app uses."
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Your profile</CardTitle>
            <CardDescription>This information is visible to other members.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <UserAvatar
                name={profile?.displayName}
                email={user?.email}
                src={profile?.photoURL}
                className="size-16 text-base"
              />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => fileInput.current?.click()}
                    disabled={avatarPending}
                  >
                    {avatarPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Camera className="size-3.5" />
                    )}
                    Change photo
                  </Button>
                  {role ? <Badge variant="secondary">{ROLE_META[role].label}</Badge> : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP or GIF. Max 2 MB. Stored at avatars/{'{uid}'}/ in Firebase Storage.
                </p>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(event) => void handleAvatar(event.target.files?.[0])}
                />
              </div>
            </div>

            <Separator />

            <form onSubmit={profileForm.handleSubmit(saveProfile)} className="space-y-4" noValidate>
              <FormField
                label="Display name"
                htmlFor="displayName"
                error={profileForm.formState.errors.displayName?.message}
                required
              >
                <Input
                  id="displayName"
                  aria-invalid={Boolean(profileForm.formState.errors.displayName)}
                  {...profileForm.register('displayName')}
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="First name"
                  htmlFor="firstName"
                  error={profileForm.formState.errors.firstName?.message}
                >
                  <Input id="firstName" {...profileForm.register('firstName')} />
                </FormField>
                <FormField
                  label="Last name"
                  htmlFor="lastName"
                  error={profileForm.formState.errors.lastName?.message}
                >
                  <Input id="lastName" {...profileForm.register('lastName')} />
                </FormField>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                  {profileForm.formState.isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  Save profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MailCheck className="size-4" />
                Email
              </CardTitle>
              <CardDescription>Used for sign-in and account recovery.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
                <span className="truncate text-sm">{user?.email ?? '—'}</span>
                <Badge variant={user?.emailVerified ? 'success' : 'warning'}>
                  {user?.emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
              {!user?.emailVerified ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => void resendVerification()}
                  disabled={resendPending}
                >
                  {resendPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
                  Resend verification email
                </Button>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-4" />
                Password
              </CardTitle>
              <CardDescription>
                {hasPasswordProvider
                  ? 'Changing your password requires the current one.'
                  : 'This account signs in with a social provider.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasPasswordProvider ? (
                <form
                  onSubmit={passwordForm.handleSubmit(savePassword)}
                  className="space-y-4"
                  noValidate
                >
                  <FormField
                    label="Current password"
                    htmlFor="currentPassword"
                    error={passwordForm.formState.errors.currentPassword?.message}
                  >
                    <Input
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      {...passwordForm.register('currentPassword')}
                    />
                  </FormField>
                  <FormField
                    label="New password"
                    htmlFor="newPassword"
                    error={passwordForm.formState.errors.newPassword?.message}
                  >
                    <Input
                      id="newPassword"
                      type="password"
                      autoComplete="new-password"
                      {...passwordForm.register('newPassword')}
                    />
                  </FormField>
                  <FormField
                    label="Confirm new password"
                    htmlFor="confirmPassword"
                    error={passwordForm.formState.errors.confirmPassword?.message}
                  >
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      {...passwordForm.register('confirmPassword')}
                    />
                  </FormField>
                  <Button
                    type="submit"
                    variant="secondary"
                    className="w-full"
                    disabled={passwordForm.formState.isSubmitting}
                  >
                    {passwordForm.formState.isSubmitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : null}
                    Update password
                  </Button>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Manage your password with your identity provider.
                </p>
              )}
            </CardContent>
          </Card>

          {hasRole('admin') ? (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="space-y-1 px-5 py-4">
                <p className="text-sm font-medium">Administrator access</p>
                <p className="text-sm text-muted-foreground">
                  You can manage members, roles and every document in the workspace.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}
