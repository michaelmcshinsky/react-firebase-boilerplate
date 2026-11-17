import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { useAuth } from '@/app/providers/auth-context'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { FormField } from '@/components/forms/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { signIn, signInWithGoogle } from '@/lib/firebase/auth'
import { getErrorMessage } from '@/lib/errors'

import { AuthLayout } from './auth-layout'
import { ConfigNotice, FormError, SubmitSpinner } from './auth-parts'
import { loginSchema, type LoginValues } from './schemas'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

export function LoginPage() {
  useDocumentTitle('Sign in')
  const { status } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)
  const [googlePending, setGooglePending] = useState(false)

  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from?: string }).from !== '/login'
      ? (location.state as { from: string }).from
      : '/dashboard'

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (status === 'authenticated') {
    return <Navigate to={from} replace />
  }

  async function onSubmit(values: LoginValues) {
    setFormError(null)
    try {
      await signIn(values.email, values.password)
      toast.success('Welcome back')
      navigate(from, { replace: true })
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  async function handleGoogle() {
    setFormError(null)
    setGooglePending(true)
    try {
      await signInWithGoogle()
      toast.success('Signed in with Google')
      navigate(from, { replace: true })
    } catch (error) {
      setFormError(getErrorMessage(error))
    } finally {
      setGooglePending(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to manage content, members and settings."
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="font-medium text-foreground hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <ConfigNotice />
        {formError ? <FormError>{formError}</FormError> : null}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
            hint={
              <Link
                to="/forgot-password"
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            }
          >
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register('password')}
            />
          </FormField>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            <SubmitSpinner pending={form.formState.isSubmitting} label="Sign in" />
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => void handleGoogle()}
          disabled={googlePending}
        >
          {googlePending ? <Loader2Icon /> : <GoogleIcon />}
          Continue with Google
        </Button>
      </div>
    </AuthLayout>
  )
}

function Loader2Icon() {
  return <Loader2 className="size-4 animate-spin" />
}
