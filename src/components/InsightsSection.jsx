import React from 'react'
import { calcDailyStats } from '../utils/calculator';

export default function InsightsSection({ foodLog }) {
  if (foodLog.length === 0) return null;

  const stats = calcDailyStats(foodLog);
  const insights = generateInsights(stats, foodLog);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">🧠</span>
        <h2 className="card-title">Personalized Insights</h2>
        <span className="card-badge">AI-Powered</span>
      </div>

      <div className="insights-grid">
        {insights.map((insight, i) => (
          <div key={i} className="insight-card">
            <div className="insight-icon">{insight.icon}</div>
            <h4>{insight.title}</h4>
            <p>{insight.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function generateInsights(stats, foodLog) {
  const insights = [];

  if (stats.sugar > 50) {
    insights.push({
      icon: '🚨',
      title: 'High Sugar Alert',
      message: `You've consumed ${stats.sugar.toFixed(0)}g of sugar today. The WHO recommends <25g daily. Consider swapping sodas for water or beans.`
    });
  }

  if (stats.fiber < 5) {
    insights.push({
      icon: '🌾',
      title: 'Boost Your Fiber',
      message: 'Adding beans, brown rice, or vegetables can improve digestion and steady your energy levels.'
    });
  }

  if (stats.qualityScore > 70) {
    insights.push({
      icon: '✨',
      title: 'Great Choices!',
      message: 'Your carb quality is excellent. You\'re favoring complex carbs that sustain energy.'
    });
  }

  if (stats.insulinStrain > 60) {
    insights.push({
      icon: '😴',
      title: 'Energy Crash Risk',
      message: 'High glycemic load means you might feel tired in 1-2 hours. Try pairing carbs with protein.'
    });
  }

  const hasSoda = foodLog.some(e => e.food.category === 'drink' && e.food.sugar > 30);
  if (hasSoda) {
    insights.push({
      icon: '🏃',
      title: 'Athletic Performance',
      message: 'Sodas spike then crash energy. Athletes perform better with yam, sweet potato, or brown rice.'
    });
  }

  if (insights.length === 0) {
    insights.push({
      icon: '💪',
      title: 'Keep Learning!',
      message: 'Every meal logged builds your metabolic intelligence. You\'re investing in long-term health.'
    });
  }

  return insights;
}
