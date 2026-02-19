import { describe, it, expect } from 'vitest'
import { calcGlycemicLoad, calcDailyStats, projectYearly } from './calculator.js'

describe('calculator utils', () => {
  it('calcGlycemicLoad computes correctly', () => {
    expect(calcGlycemicLoad(50, 40)).toBe(20)
    expect(calcGlycemicLoad(100, 10)).toBe(10)
  })

  it('calcDailyStats aggregates a simple food log', () => {
    const foodLog = [
      { food: { carbs: 50, sugar: 10, fiber: 2, gi: 70 }, quantity: 1 },
      { food: { carbs: 20, sugar: 5, fiber: 1, gi: 30 }, quantity: 2 },
    ]

    const stats = calcDailyStats(foodLog)

    expect(stats.carbs).toBeCloseTo(50 + 20 * 2)
    expect(stats.sugar).toBeCloseTo(10 + 5 * 2)
    expect(typeof stats.qualityScore).toBe('number')
  })

  it('projectYearly returns expected units', () => {
    const daily = { sugar: 10, carbs: 100, insulinStrain: 20 }
    const p = projectYearly(daily)
    expect(p.sugarKg).toBeCloseTo((10 * 365) / 1000)
    expect(p.totalCarbs).toBe(100 * 365)
    expect(p.avgInsulinStrain).toBe(20)
  })
})
