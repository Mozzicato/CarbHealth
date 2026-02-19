import React from 'react'

export default function ProjectionCard({ yearly }) {
  const sugar = yearly?.sugarKg ?? 0
  const carbsKg = yearly?.totalCarbs ? (yearly.totalCarbs / 1000) : 0
  const strain = yearly?.avgInsulinStrain ?? 0

  return (
    <div className="card projection">
      <h3>📈 1-Year Projection</h3>
      <div className="projection-stat">
        <span className="big-number">{sugar.toFixed(1)}kg</span>
        <span className="label">Sugar consumed per year</span>
      </div>
      <div className="projection-stat">
        <span className="big-number">{carbsKg.toFixed(1)}kg</span>
        <span className="label">Total carbs per year</span>
      </div>
      <div className="projection-stat">
        <span className="label">Avg. insulin strain</span>
        <div style={{height:8, background:'#eee', borderRadius:8, marginTop:6}}>
          <div style={{width:`${Math.min(100,strain)}%`, height:8, background:'#10b981', borderRadius:8}} />
        </div>
      </div>
    </div>
  )
}
