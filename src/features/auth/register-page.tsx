import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth } from '@/app/providers/auth-context'
import { FormField } from '@/components/forms/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signUp } from '@/lib/firebase/auth'
import { getErrorMessage } from '@/lib/errors'

import { AuthLayout } from './auth-layout'
import { ConfigNotice, FormError, SubmitSpinner } from './auth-parts'
import { registerSchema, type RegisterValues } from './schemas'

export function RegisterPage() {
  const { status } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    document.title = 'Create account · React Firebase Boilerplate'
  }, [])

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />
  }

  async function onSubmit(values: RegisterValues) {
    setFormError(null)
    try {
      await signUp({
        email: values.email,
        password: values.password,
        displayName: values.displayName,
      })
      toast.success('Account created', {
        description: 'We sent a verification link to your inbox.',
      })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Members can write drafts. An administrator promotes accounts to editor or admin."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <ConfigNotice />
        {formError ? <FormError>{formError}</FormError> : null}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            label="Name"
            htmlFor="displayName"
            error={form.formState.errors.displayName?.message}
          >
            <Input
              id="displayName"
              autoComplete="name"
              placeholder="Ada Lovelace"
              aria-invalid={Boolean(form.formState.errors.displayName)}
              {...form.register('displayName')}
            />
          </FormField>

          <FormField label="Email" htmlFor="email" error={form.formState.errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register('email')}
            />
          </FormField>

          <FormField
            label="Password"
            htmlFor="password"
            error={form.formState.errors.password?.message}
            hint="8+ characters"
          >
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register('password')}
            />
          </FormField>

          <FormField
            label="Confirm password"
            htmlFor="confirmPassword"
            error={form.formState.errors.confirmPassword?.message}
          >
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={Boolean(form.formState.errors.confirmPassword)}
              {...form.register('confirmPassword')}
            />
          </FormField>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            <SubmitSpinner pending={form.formState.isSubmitting} label="Create account" />
          </Button>
        </form>

        <p className="text-xs leading-relaxed text-muted-foreground">
          By creating an account you agree to the project’s terms. This starter ships without a
          marketing email pipeline or analytics.
        </p>
      </div>
    </AuthLayout>
  )
}
