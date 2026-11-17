import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ErrorBoundary } from './error-boundary'

function Boom(): never {
  throw new Error('Kaboom')
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>healthy screen</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('healthy screen')).toBeInTheDocument()
  })

  it('shows the recovery panel instead of a blank page', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )

    expect(
      screen.getByRole('heading', { name: 'Something broke on this screen' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Kaboom')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
  })

  it('supports a custom fallback with a reset action', async () => {
    let shouldThrow = true

    function Sometimes() {
      if (shouldThrow) throw new Error('transient')
      return <p>recovered</p>
    }

    render(
      <ErrorBoundary
        fallback={(error, reset) => (
          <button
            type="button"
            onClick={() => {
              shouldThrow = false
              reset()
            }}
          >
            Retry {error.message}
          </button>
        )}
      >
        <Sometimes />
      </ErrorBoundary>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Retry transient' }))

    expect(screen.getByText('recovered')).toBeInTheDocument()
  })
})
