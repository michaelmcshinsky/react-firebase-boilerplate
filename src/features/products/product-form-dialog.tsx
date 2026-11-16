import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

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
import { createProduct, updateProduct } from '@/services/products'
import type { Product } from '@/types'

import { emptyProductValues, productFormSchema, type ProductFormValues } from './schema'

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: emptyProductValues,
  })

  useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form state when dialog opens
    setFormError(null)
    form.reset(
      product
        ? {
            name: product.name,
            sku: product.sku,
            description: product.description,
            price: product.price,
            visibility: product.visibility,
          }
        : emptyProductValues,
    )
  }, [open, product, form])

  async function onSubmit(values: ProductFormValues) {
    setFormError(null)
    try {
      if (product) {
        await updateProduct(product.id, values)
        toast.success('Product updated')
      } else {
        await createProduct(values)
        toast.success('Product created')
      }
      onOpenChange(false)
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit product' : 'New product'}</DialogTitle>
          <DialogDescription>
            Public products can be read by anyone. Private products are staff-only.
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
            label="Name"
            htmlFor="name"
            error={form.formState.errors.name?.message}
            required
          >
            <Input
              id="name"
              placeholder="Studio licence"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register('name')}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="SKU"
              htmlFor="sku"
              error={form.formState.errors.sku?.message}
              required
            >
              <Input
                id="sku"
                placeholder="STUDIO-01"
                className="uppercase"
                aria-invalid={Boolean(form.formState.errors.sku)}
                {...form.register('sku')}
              />
            </FormField>

            <FormField
              label="Price"
              htmlFor="price"
              error={form.formState.errors.price?.message}
              hint="USD"
              required
            >
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                aria-invalid={Boolean(form.formState.errors.price)}
                {...form.register('price', { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <FormField label="Visibility" htmlFor="visibility" required>
            <Controller
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="visibility" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public — anyone can read</SelectItem>
                    <SelectItem value="private">Private — staff only</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField
            label="Description"
            htmlFor="description"
            error={form.formState.errors.description?.message}
          >
            <Textarea
              id="description"
              rows={3}
              placeholder="What is included, who it is for…"
              {...form.register('description')}
            />
          </FormField>

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
              {product ? 'Save changes' : 'Create product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
