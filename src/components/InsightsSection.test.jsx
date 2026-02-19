import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import InsightsSection from './InsightsSection'

describe('InsightsSection', () => {
  it('returns null when no food logged', () => {
    const { container } = render(<InsightsSection foodLog={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows high sugar insight when sugar > 50', () => {
    const foodLog = [
      { food: { carbs: 100, sugar: 60, fiber: 0, gi: 80 }, quantity: 1 },
    ]
    render(<InsightsSection foodLog={foodLog} />)
    expect(screen.getByText(/High Sugar Alert/i)).toBeInTheDocument()
  })

  it('fetches AI insights when requested', async () => {
    const foodLog = [ { food: { carbs: 40, sugar: 10, fiber: 2, gi: 60 }, quantity: 1 } ]
    const mockAi = { insights: [ { title: 'AI Tip', message: 'AI suggestion', severity: 'low' } ], summary: 'ok' }

    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true, ai: mockAi }) }))

    render(<InsightsSection foodLog={foodLog} />)

    const btn = screen.getByRole('button', { name: /Get AI Insights/i })
    await userEvent.click(btn)

    expect(await screen.findByText(/AI Tip/)).toBeInTheDocument()

    global.fetch.mockRestore?.()
  })
})