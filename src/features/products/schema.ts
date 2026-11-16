import { z } from 'zod'

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Give the product a name.')
    .max(80, 'Keep names under 80 characters.'),
  sku: z
    .string()
    .trim()
    .min(2, 'Use at least two characters.')
    .max(24, 'Keep SKUs under 24 characters.')
    .regex(/^[A-Za-z0-9-]+$/, 'Use letters, numbers and dashes only.'),
  description: z.string().trim().max(400, 'Keep descriptions under 400 characters.'),
  price: z.number().min(0, 'Price cannot be negative.').max(1_000_000, 'That price is too high.'),
  visibility: z.enum(['public', 'private']),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export const emptyProductValues: ProductFormValues = {
  name: '',
  sku: '',
  description: '',
  price: 0,
  visibility: 'public',
}
