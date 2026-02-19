import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, it, expect } from 'vitest'
import ProjectionCard from './ProjectionCard'

describe('ProjectionCard', () => {
  it('renders yearly numbers and progress', () => {
    render(<ProjectionCard yearly={{ sugarKg: 14.2, totalCarbs: 2000, avgInsulinStrain: 45 }} />)

    expect(screen.getByText(/14.2kg/)).toBeInTheDocument()
    expect(screen.getByText(/2.0kg/)).toBeInTheDocument()
    expect(screen.getByText(/Avg. insulin strain/i)).toBeInTheDocument()
  })
})
