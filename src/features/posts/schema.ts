import { z } from 'zod'

export const postFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Give the post a title (3+ characters).')
    .max(120, 'Keep titles under 120 characters.'),
  summary: z.string().trim().max(240, 'Keep the summary under 240 characters.'),
  body: z.string().trim().min(20, 'Write at least a sentence or two.'),
  status: z.enum(['draft', 'published']),
  tags: z.string().max(160, 'Keep tags under 160 characters.'),
})

export type PostFormValues = z.infer<typeof postFormSchema>

export const emptyPostValues: PostFormValues = {
  title: '',
  summary: '',
  body: '',
  status: 'draft',
  tags: '',
}

export function splitTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim().replace(/^#/, ''))
    .filter(Boolean)
    .slice(0, 8)
}

export function joinTags(tags: string[] | undefined) {
  return (tags ?? []).join(', ')
}
