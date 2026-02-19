import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Dashboard from './Dashboard'

describe('Dashboard', () => {
  it('shows empty state when no food logged', () => {
    render(<Dashboard foodLog={[]} />)
    expect(screen.getByText(/No Data Yet/i)).toBeInTheDocument()
  })

  it('renders metrics when food log present', () => {
    const foodLog = [
      { food: { carbs: 50, sugar: 10, fiber: 2, gi: 70 }, quantity: 1 },
    ]
    render(<Dashboard foodLog={foodLog} />)
    expect(screen.getByText(/Carb Quality/i)).toBeInTheDocument()
    expect(screen.getByText(/1-Year Projection/i)).toBeInTheDocument()
  })
})
