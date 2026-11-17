import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { FormField } from '@/components/forms/form-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { requestPasswordReset } from '@/lib/firebase/auth'
import { getErrorMessage } from '@/lib/errors'

import { AuthLayout } from './auth-layout'
import { ConfigNotice, FormError, SubmitSpinner } from './auth-parts'
import { forgotPasswordSchema, type ForgotPasswordValues } from './schemas'
import { useDocumentTitle } from '@/hooks/use-document-title'

export function ForgotPasswordPage() {
  useDocumentTitle('Reset password')
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotPasswordValues) {
    setFormError(null)
    try {
      await requestPasswordReset(values.email)
      setSentTo(values.email)
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  return (
    <AuthLayout
      title={sentTo ? 'Check your inbox' : 'Reset your password'}
      description={
        sentTo
          ? `If an account exists for ${sentTo}, a reset link is on its way. The link expires in one hour.`
          : 'Enter the email tied to your account and we will send a secure reset link.'
      }
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 hover:underline">
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      }
    >
      {sentTo ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-8 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-success/15 text-success">
            <MailCheck className="size-5" />
          </div>
          <p className="text-sm font-medium">Reset email sent</p>
          <p className="text-sm text-muted-foreground">
            Didn’t get it? Check spam, or{' '}
            <button
              type="button"
              className="font-medium text-foreground hover:underline"
              onClick={() => setSentTo(null)}
            >
              try another address
            </button>
            .
          </p>
        </div>
      ) : (
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

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              <SubmitSpinner pending={form.formState.isSubmitting} label="Send reset link" />
            </Button>
          </form>
        </div>
      )}
    </AuthLayout>
  )
}
