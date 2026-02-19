import React, { useState, useEffect, useCallback, useRef } from 'react'
import { calcDailyStats } from '../utils/calculator';

export default function InsightsSection({ foodLog }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState(null);

  const stats = calcDailyStats(foodLog || []);
  const localInsights = generateInsights(stats, foodLog || []);

  const fetchAiInsights = useCallback(async () => {
    if (!foodLog || foodLog.length === 0) return;

    setAiLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodLog }),
      });
      const json = await r.json();
      if (json?.ok && json.ai) {
        setAiResult({ ...json.ai, _provider: json.provider });
      } else {
        setError(json?.error || json?.details || 'AI Service temporarily unavailable');
      }
    } catch (err) {
      console.error('AI Insight Error:', err);
      setError('Connection failed. Please check your network.');
    } finally {
      setAiLoading(false);
    }
  }, [foodLog]);

  // Robust Automatic Update on log change
  useEffect(() => {
    if (foodLog.length === 0) {
      setAiResult(null);
      return;
    }

    // Always fetch on new length, with debounce
    const timer = setTimeout(() => {
      fetchAiInsights();
    }, 1500);

    return () => clearTimeout(timer);
  }, [foodLog.length, fetchAiInsights]);

  if (!foodLog || foodLog.length === 0) return null;

  return (
    <section className="insights-container">
      <div className="card insights-main-card">
        <div className="card-header">
          <div className="card-header-main">
            <span className="card-icon">🧠</span>
            <div>
              <h2 className="card-title">Metabolic Intelligence</h2>
              <p className="card-subtitle">AI analysis of your glucose & insulin response</p>
            </div>
          </div>
          <div className="card-actions">
            {aiLoading && <div className="loading-status"><span className="loading-spinner"></span> Analyzing...</div>}
            <button className="btn-refresh" onClick={fetchAiInsights} title="Force Refresh">
              <span className="icon">🔄</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="insight-error-banner">
            <span className="icon">⚠️</span>
            <p>{error}</p>
            <button onClick={fetchAiInsights} className="btn-retry">Retry</button>
          </div>
        )}

        <div className="insights-layout">
          {/* AI INSIGHTS SECTION */}
          <div className="ai-insights-section">
            <h3 className="section-label">
              <span className="dot"></span> AI Synthesis
            </h3>

            <div className="insights-grid">
              {aiLoading && !aiResult ? (
                // Skeleton cards
                [1, 2, 3].map(i => (
                  <div key={i} className="insight-card skeleton">
                    <div className="skeleton-line" style={{ width: '40%' }}></div>
                    <div className="skeleton-line" style={{ width: '100%' }}></div>
                    <div className="skeleton-line" style={{ width: '80%' }}></div>
                  </div>
                ))
              ) : aiResult && Array.isArray(aiResult.insights) ? (
                aiResult.insights.map((insight, i) => (
                  <div key={i} className={`insight-card severity-${insight.severity || 'low'}`}>
                    <div className="insight-header">
                      <span className="severity-badge">{insight.severity || 'low'}</span>
                      <span className="insight-icon-small">{insight.severity === 'high' ? '🚨' : '💡'}</span>
                    </div>
                    <h4>{insight.title}</h4>
                    <p>{insight.message}</p>
                  </div>
                ))
              ) : (
                <div className="ai-empty-prompt">
                  <p>Logging more meals helps build your AI metabolic profile.</p>
                </div>
              )}
            </div>

            {aiResult?.summary && (
              <div className="ai-summary-box">
                <strong>Summary:</strong> {aiResult.summary}
              </div>
            )}
          </div>

          {/* QUICK CHECKS (Local Logic) */}
          <div className="local-insights-section">
            <h3 className="section-label">Quick Checks</h3>
            <div className="mini-insights-stack">
              {localInsights.map((insight, i) => (
                <div key={i} className="insight-mini-card">
                  <span className="mini-icon">{insight.icon}</span>
                  <div className="mini-content">
                    <h4>{insight.title}</h4>
                    <p>{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function generateInsights(stats, foodLog) {
  const insights = [];

  if (stats.sugar > 40) {
    insights.push({ icon: '🚨', title: 'Sugar Peak', message: 'Critical insulin load detected.' });
  }

  if (stats.fiber < 5) {
    insights.push({ icon: '🌾', title: 'Fiber Gap', message: 'Add legumes for stability.' });
  }

  if (stats.qualityScore > 75) {
    insights.push({ icon: '✨', title: 'Clean Path', message: 'Nutrient-dense carb choices.' });
  }

  if (stats.insulinStrain > 60) {
    insights.push({ icon: '😴', title: 'Energy Risk', message: 'Possible mid-day fatigue.' });
  }

  if (insights.length < 3) {
    insights.push({ icon: '📈', title: 'Monitoring', message: 'Tracking your glucose levels.' });
  }

  return insights.slice(0, 4);
}
