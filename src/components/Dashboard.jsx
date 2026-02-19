import React from 'react'
import { calcDailyStats, projectYearly, getMetricColor } from '../utils/calculator'

export default function Dashboard({ foodLog, onClearLog }) {
  if (!foodLog || foodLog.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>No Data Yet</h3>
          <p>Log your first meal to unlock your metabolic insights!</p>
        </div>
      </div>
    )
  }

  const stats = calcDailyStats(foodLog)
  const yearly = projectYearly(stats)

  return (
    <div>
      {/* QUICK STATS */}
      <div className="quick-stats">
        <div className="quick-stat">
          <div className="quick-stat-value" style={{ color: '#f59e0b' }}>{stats.carbs.toFixed(0)}g</div>
          <div className="quick-stat-label">Total Carbs</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-value" style={{ color: '#ef4444' }}>{stats.sugar.toFixed(0)}g</div>
          <div className="quick-stat-label">Sugar</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-value" style={{ color: '#10b981' }}>{stats.fiber.toFixed(1)}g</div>
          <div className="quick-stat-label">Fiber</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-value" style={{ color: '#6366f1' }}>{stats.glycemicLoad.toFixed(0)}</div>
          <div className="quick-stat-label">Glycemic Load</div>
        </div>
      </div>

      {/* METRIC GAUGES */}
      <div className="card">
        <div className="card-header">
          <span className="card-icon">⚡</span>
          <h2 className="card-title">Today's Metrics</h2>
        </div>
        
        <div className="metrics-grid">
          <MetricGauge
            label="Carb Quality Score"
            value={stats.qualityScore}
            max={100}
            color={getMetricColor(stats.qualityScore)}
            tooltip="Higher is better. Based on fiber content and glycemic load."
          />
          <MetricGauge
            label="Energy Stability"
            value={stats.energyStability}
            max={100}
            color={getMetricColor(stats.energyStability)}
            tooltip="How steady your energy levels will be throughout the day."
          />
          <MetricGauge
            label="Insulin Strain"
            value={stats.insulinStrain}
            max={100}
            color={getMetricColor(stats.insulinStrain, true)}
            tooltip="Lower is better. How hard your body works to process glucose."
          />
        </div>
      </div>

      {/* PROJECTION */}
      <div className="projection-card">
        <div className="card-header" style={{ marginBottom: '8px' }}>
          <span className="card-icon">🔮</span>
          <h2 className="card-title">1-Year Projection</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          If you maintain today's eating pattern...
        </p>
        
        <div className="projection-grid">
          <div className="projection-stat">
            <div className="projection-number">{yearly.sugarKg.toFixed(1)}kg</div>
            <div className="projection-label">Sugar consumed</div>
          </div>
          <div className="projection-stat">
            <div className="projection-number">{(yearly.totalCarbs / 1000).toFixed(0)}kg</div>
            <div className="projection-label">Total carbohydrates</div>
          </div>
          <div className="projection-stat">
            <div className="projection-number">{yearly.avgInsulinStrain}%</div>
            <div className="projection-label">Avg insulin strain</div>
          </div>
        </div>

        {yearly.sugarKg > 15 && (
          <div className="projection-warning">
            <span className="projection-warning-icon">⚠️</span>
            <p>
              <strong>Health Alert:</strong> This sugar intake is 2.5x the WHO recommendation.
              Consider reducing sodas and refined carbs.
            </p>
          </div>
        )}
      </div>

      {/* FOOD LOG */}
      <div className="card">
        <div className="card-header">
          <span className="card-icon">📝</span>
          <h2 className="card-title">Today's Log</h2>
          <button onClick={onClearLog} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            Clear All
          </button>
        </div>
        
        <div className="food-log-list">
          {foodLog.map((entry, i) => (
            <div key={i} className="log-item">
              <div className="log-item-info">
                <div className="log-item-name">{entry.food.name}</div>
                <div className="log-item-meta">
                  {entry.food.carbs * entry.quantity}g carbs • 
                  {entry.food.sugar * entry.quantity}g sugar •
                  GI: {entry.food.gi}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="log-item-quantity">×{entry.quantity}</span>
                <span className="log-item-time">
                  {new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricGauge({ label, value, max, color, tooltip }) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="metric-gauge">
      <div className="metric-header">
        <span className="metric-label tooltip" data-tooltip={tooltip}>
          {label} ℹ️
        </span>
        <span className="metric-value" style={{ color }}>
          {value}<span style={{ fontSize: '1.2rem', opacity: 0.5 }}>/{max}</span>
        </span>
      </div>
      <div className="gauge-bar">
        <div 
          className="gauge-fill" 
          style={{ 
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`
          }}
        />
      </div>
    </div>
  )
}
