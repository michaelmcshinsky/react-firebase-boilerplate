import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './button'

describe('Button', () => {
  it('renders its label and handles clicks', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save changes</Button>)

    const button = screen.getByRole('button', { name: 'Save changes' })
    await userEvent.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant and size classes', () => {
    render(
      <Button variant="destructive" size="sm">
        Delete
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Delete' })
    expect(button.className).toContain('bg-destructive')
    expect(button.className).toContain('h-8')
  })

  it('supports asChild composition', () => {
    render(
      <Button asChild>
        <a href="/docs">Read the docs</a>
      </Button>,
    )

    expect(screen.getByRole('link', { name: 'Read the docs' })).toHaveAttribute('href', '/docs')
  })

  it('is disabled when requested', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled()
  })
})
