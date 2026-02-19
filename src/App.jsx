import React, { useState, useEffect } from 'react';
import FoodLogger from './components/FoodLogger';
import Dashboard from './components/Dashboard';
import TriviaPopup from './components/TriviaPopup';
import InsightsSection from './components/InsightsSection';

// Environment-controlled defaults (Vite expects VITE_ prefix)
const APP_TITLE = import.meta.env.VITE_APP_TITLE ?? 'CarbHEALTH';
const INITIAL_USERS = Number(import.meta.env.VITE_INITIAL_USERS ?? 1247);
const INITIAL_SUGAR_SAVED = Number(import.meta.env.VITE_INITIAL_SUGAR_SAVED ?? 34.5);
const ENABLE_TRIVIA = (import.meta.env.VITE_ENABLE_TRIVIA ?? 'true') === 'true';

export default function App() {
  const [foodLog, setFoodLog] = useState(() => {
    try {
      const raw = localStorage.getItem('carbhealth.foodLog');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [showTrivia, setShowTrivia] = useState(false);
  const [streak, setStreak] = useState(() => {
    try {
      const raw = localStorage.getItem('carbhealth.streak');
      return raw ? Number(raw) : 0;
    } catch (e) {
      return 0;
    }
  });
  const [totalUsers, setTotalUsers] = useState(INITIAL_USERS);
  const [sugarSaved, setSugarSaved] = useState(INITIAL_SUGAR_SAVED);

  // persist foodLog + streak
  useEffect(() => {
    try {
      localStorage.setItem('carbhealth.foodLog', JSON.stringify(foodLog));
      localStorage.setItem('carbhealth.streak', String(streak));
    } catch (e) {
      // ignore
    }
  }, [foodLog, streak]);

  // Simulate live stats updating
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalUsers(prev => prev + Math.floor(Math.random() * 3));
      setSugarSaved(prev => Number((prev + Math.random() * 0.5).toFixed(1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Show trivia after 3 items logged
  useEffect(() => {
    if (ENABLE_TRIVIA && foodLog.length > 0 && foodLog.length % 3 === 0) {
      setShowTrivia(true);
    }
  }, [foodLog.length]);

  const handleAddFood = (entry) => {
    setFoodLog(prev => [...prev, entry]);
    setStreak(s => s + 1);
  };

  const handleClearLog = () => {
    if (confirm('Clear all logged foods?')) {
      setFoodLog([]);
      setStreak(0);
    }
  };

  return (
    <div className="app">
      {/* HERO HEADER */}
      <header className="hero-header">
        <div className="hero-badge">⚡ Powered by AI Metabolic Intelligence</div>
        <h1 className="hero-title">{APP_TITLE}</h1>
        <p className="hero-subtitle">
          Understand how every meal affects your energy, performance, and long-term health.
          Make smarter choices with real-time metabolic insights.
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-number">{totalUsers.toLocaleString()}</div>
            <div className="hero-stat-label">Active Users</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">{sugarSaved.toFixed(1)}kg</div>
            <div className="hero-stat-label">Sugar Saved Today</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">98%</div>
            <div className="hero-stat-label">Improved Awareness</div>
          </div>
        </div>
      </header>

      {/* STREAK BANNER */}
      {streak > 0 && (
        <div className="streak-banner">
          <div className="streak-icon">🔥</div>
          <div className="streak-content">
            <h3>{streak} {streak === 1 ? 'Item' : 'Items'} Logged Today!</h3>
            <p>You're building metabolic intelligence. Keep going!</p>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="main-grid">
        <FoodLogger onAdd={handleAddFood} />
        <Dashboard foodLog={foodLog} onClearLog={handleClearLog} />
      </div>

      {/* INSIGHTS */}
      <InsightsSection foodLog={foodLog} />

      {/* TRIVIA */}
      {showTrivia && <TriviaPopup onClose={() => setShowTrivia(false)} />}
    </div>
  );
}
