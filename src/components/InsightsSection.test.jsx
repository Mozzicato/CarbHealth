import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
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
})