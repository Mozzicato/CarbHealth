// Calculate glycemic load (GI × carbs / 100)
export const calcGlycemicLoad = (gi, carbs) => {
  return (gi * carbs) / 100
}

// Calculate daily stats from food log
export const calcDailyStats = (foodLog) => {
  const totals = foodLog.reduce(
    (acc, entry) => {
      const food = entry.food
      const qty = entry.quantity || 1

      return {
        carbs: acc.carbs + food.carbs * qty,
        sugar: acc.sugar + food.sugar * qty,
        fiber: acc.fiber + food.fiber * qty,
        glycemicLoad: acc.glycemicLoad + calcGlycemicLoad(food.gi, food.carbs * qty),
      }
    },
    { carbs: 0, sugar: 0, fiber: 0, glycemicLoad: 0 }
  )

  const qualityScore = Math.max(0, Math.min(100, 100 - totals.glycemicLoad + totals.fiber * 2))

  const insulinStrain = Math.min(100, (totals.glycemicLoad / 150) * 100)

  const energyStability = Math.max(0, 100 - insulinStrain)

  return {
    ...totals,
    qualityScore: Math.round(qualityScore),
    insulinStrain: Math.round(insulinStrain),
    energyStability: Math.round(energyStability),
  }
}

// Project yearly impact
export const projectYearly = (dailyStats) => {
  return {
    sugarKg: (dailyStats.sugar * 365) / 1000,
    totalCarbs: dailyStats.carbs * 365,
    avgInsulinStrain: dailyStats.insulinStrain,
  }
}

// Get color for metric
export const getMetricColor = (value, inverse = false) => {
  if (inverse) value = 100 - value
  if (value >= 70) return '#10b981'
  if (value >= 40) return '#f59e0b'
  return '#ef4444'
}
