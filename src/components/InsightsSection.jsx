import React, { useState } from 'react'
import { calcDailyStats } from '../utils/calculator';

export default function InsightsSection({ foodLog }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  if (!foodLog || foodLog.length === 0) return null;

  const stats = calcDailyStats(foodLog);
  const localInsights = generateInsights(stats, foodLog);

  const fetchAiInsights = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const r = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodLog }),
      });
      const json = await r.json();
      if (json?.ok && json.ai) setAiResult(json.ai);
      else setAiResult({ raw: json?.error || 'No AI response' });
    } catch (err) {
      setAiResult({ raw: String(err) });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">🧠</span>
        <h2 className="card-title">Personalized Insights</h2>
        <span className="card-badge">AI-Powered</span>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button className="btn-primary" onClick={fetchAiInsights} disabled={aiLoading}>
          {aiLoading ? 'Generating AI insights...' : 'Get AI Insights'}
        </button>
        <button className="btn-secondary" onClick={() => setAiResult(null)}>Reset</button>
      </div>

      {aiResult ? (
        <div className="insights-grid">
          {Array.isArray(aiResult.insights) ? (
            aiResult.insights.map((insight, i) => (
              <div key={i} className="insight-card">
                <div className="insight-icon">{insight.severity === 'high' ? '🚨' : '💡'}</div>
                <h4>{insight.title}</h4>
                <p>{insight.message}</p>
              </div>
            ))
          ) : (
            <div className="insight-card">
              <pre style={{ whiteSpace: 'pre-wrap' }}>{aiResult.raw || JSON.stringify(aiResult)}</pre>
            </div>
          )}
        </div>
      ) : (
        <div className="insights-grid">
          {localInsights.map((insight, i) => (
            <div key={i} className="insight-card">
              <div className="insight-icon">{insight.icon}</div>
              <h4>{insight.title}</h4>
              <p>{insight.message}</p>
            </div>
          ))}
        </div>
      )}
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
