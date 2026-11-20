import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useAuth } from '@/app/providers/auth-context'
import { FormField } from '@/components/forms/form-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage } from '@/lib/errors'
import { createPost, updatePost } from '@/services/posts'
import type { Post } from '@/types'

import { emptyPostValues, joinTags, postFormSchema, splitTags, type PostFormValues } from './schema'

interface PostFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: Post | null
}

export function PostFormDialog({ open, onOpenChange, post }: PostFormDialogProps) {
  const { user, profile } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: emptyPostValues,
  })

  useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form state when dialog opens
    setFormError(null)
    form.reset(
      post
        ? {
            title: post.title,
            summary: post.summary,
            body: post.body,
            status: post.status,
            tags: joinTags(post.tags),
          }
        : emptyPostValues,
    )
  }, [open, post, form])

  async function onSubmit(values: PostFormValues) {
    setFormError(null)
    const payload = {
      title: values.title,
      summary: values.summary,
      body: values.body,
      status: values.status,
      tags: splitTags(values.tags),
    }

    try {
      if (post) {
        await updatePost(post.id, payload)
        toast.success('Post updated')
      } else {
        if (!user) throw new Error('You need to be signed in to create a post.')
        await createPost(payload, {
          id: user.uid,
          displayName: profile?.displayName || user.displayName || user.email || 'Member',
        })
        toast.success('Post created')
      }
      onOpenChange(false)
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit post' : 'New post'}</DialogTitle>
          <DialogDescription>
            {post
              ? 'Changes are written to Firestore immediately and reflected everywhere.'
              : 'Drafts stay private to you until a staff member publishes them.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {formError ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/25 bg-destructive/8 px-3 py-2 text-sm text-destructive"
            >
              {formError}
            </div>
          ) : null}

          <FormField
            label="Title"
            htmlFor="title"
            error={form.formState.errors.title?.message}
            required
          >
            <Input
              id="title"
              placeholder="How we ship on Fridays"
              aria-invalid={Boolean(form.formState.errors.title)}
              {...form.register('title')}
            />
          </FormField>

          <FormField
            label="Summary"
            htmlFor="summary"
            error={form.formState.errors.summary?.message}
            hint="Optional"
          >
            <Input
              id="summary"
              placeholder="One line that explains the post"
              {...form.register('summary')}
            />
          </FormField>

          <FormField
            label="Body"
            htmlFor="body"
            error={form.formState.errors.body?.message}
            required
          >
            <Textarea
              id="body"
              rows={7}
              placeholder="Markdown or plain text: your renderer, your rules."
              aria-invalid={Boolean(form.formState.errors.body)}
              {...form.register('body')}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Status" htmlFor="status" required>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              label="Tags"
              htmlFor="tags"
              error={form.formState.errors.tags?.message}
              hint="Comma separated"
            >
              <Input id="tags" placeholder="design, release" {...form.register('tags')} />
            </FormField>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {post ? 'Save changes' : 'Create post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
