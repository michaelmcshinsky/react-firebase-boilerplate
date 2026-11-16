import { describe, expect, it } from 'vitest'

import { joinTags, postFormSchema, splitTags } from './schema'

describe('post form schema', () => {
  it('accepts a valid draft', () => {
    const result = postFormSchema.safeParse({
      title: 'Shipping on Fridays',
      summary: 'A short summary',
      body: 'A body long enough to pass validation.',
      status: 'draft',
      tags: 'release, process',
    })

    expect(result.success).toBe(true)
  })

  it('requires a title and a body', () => {
    const result = postFormSchema.safeParse({
      title: 'No',
      summary: '',
      body: 'too short',
      status: 'published',
      tags: '',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const fields = result.error.issues.map((issue) => issue.path[0])
      expect(fields).toContain('title')
      expect(fields).toContain('body')
    }
  })

  it('rejects an unknown status', () => {
    const result = postFormSchema.safeParse({
      title: 'A title',
      summary: '',
      body: 'A body long enough to pass validation.',
      status: 'archived',
      tags: '',
    })

    expect(result.success).toBe(false)
  })
})

describe('tags helpers', () => {
  it('splits, trims and strips hashes', () => {
    expect(splitTags(' #Design, release ,, ')).toEqual(['Design', 'release'])
  })

  it('caps the number of tags', () => {
    expect(splitTags('a,b,c,d,e,f,g,h,i,j')).toHaveLength(8)
  })

  it('joins tags for the form input', () => {
    expect(joinTags(['design', 'release'])).toBe('design, release')
    expect(joinTags(undefined)).toBe('')
  })
})
