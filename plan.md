🚀 CarbHEALTH - 1-Hour MVP Build Plan
⏱️ Time Budget Breakdown

0-15 min: Setup + Food Logger
15-30 min: Dashboard + Calculations
30-45 min: Trivia System
45-60 min: Polish + Demo Ready


📁 Project Structure
carbhealth/
├── src/
│   ├── components/
│   │   ├── FoodLogger.jsx       # Input form
│   │   ├── Dashboard.jsx        # Main metrics display
│   │   ├── TriviaPopup.jsx      # Quiz system
│   │   └── ProjectionCard.jsx   # Future impact visual
│   ├── data/
│   │   ├── foods.js            # Food database
│   │   └── trivia.js           # Questions bank
│   ├── utils/
│   │   └── calculator.js       # All math logic
│   ├── App.jsx
│   └── index.css
├── package.json
└── README.md

🗂️ COPY-PASTE DATA FILES
src/data/foods.js
javascriptexport const FOODS = [
  // Drinks
  { id: 1, name: "Coca-Cola (330ml)", category: "drink", carbs: 39, gi: 63, fiber: 0, sugar: 39 },
  { id: 2, name: "Pepsi (330ml)", category: "drink", carbs: 41, gi: 63, fiber: 0, sugar: 41 },
  { id: 3, name: "Fanta (330ml)", category: "drink", carbs: 44, gi: 68, fiber: 0, sugar: 44 },
  { id: 4, name: "Sprite (330ml)", category: "drink", carbs: 38, gi: 63, fiber: 0, sugar: 38 },
  
  // Staples
  { id: 5, name: "White Rice (1 cup)", category: "staple", carbs: 45, gi: 73, fiber: 0.6, sugar: 0 },
  { id: 6, name: "Brown Rice (1 cup)", category: "staple", carbs: 45, gi: 68, fiber: 3.5, sugar: 0 },
  { id: 7, name: "Jollof Rice (1 cup)", category: "staple", carbs: 50, gi: 70, fiber: 2, sugar: 5 },
  { id: 8, name: "Fried Rice (1 cup)", category: "staple", carbs: 48, gi: 72, fiber: 1.5, sugar: 3 },
  
  // Tubers
  { id: 9, name: "Yam (1 medium piece)", category: "tuber", carbs: 37, gi: 54, fiber: 4, sugar: 0.5 },
  { id: 10, name: "Sweet Potato (1 medium)", category: "tuber", carbs: 27, gi: 70, fiber: 4, sugar: 6 },
  { id: 11, name: "Irish Potato (1 medium)", category: "tuber", carbs: 34, gi: 82, fiber: 2.4, sugar: 1 },
  { id: 12, name: "Plantain (1 medium, fried)", category: "tuber", carbs: 48, gi: 65, fiber: 3, sugar: 22 },
  
  // Swallow
  { id: 13, name: "Eba (1 wrap)", category: "swallow", carbs: 89, gi: 84, fiber: 2, sugar: 0 },
  { id: 14, name: "Fufu (1 wrap)", category: "swallow", carbs: 84, gi: 68, fiber: 1.5, sugar: 0 },
  { id: 15, name: "Pounded Yam (1 wrap)", category: "swallow", carbs: 118, gi: 66, fiber: 4, sugar: 0 },
  { id: 16, name: "Amala (1 wrap)", category: "swallow", carbs: 92, gi: 70, fiber: 5, sugar: 0 },
  
  // Legumes
  { id: 17, name: "Beans (1 cup cooked)", category: "legume", carbs: 40, gi: 29, fiber: 13, sugar: 0 },
  { id: 18, name: "Moi Moi (1 wrap)", category: "legume", carbs: 24, gi: 33, fiber: 8, sugar: 1 },
  
  // Bread/Pastry
  { id: 19, name: "White Bread (2 slices)", category: "bread", carbs: 30, gi: 75, fiber: 1.5, sugar: 4 },
  { id: 20, name: "Agege Bread (2 slices)", category: "bread", carbs: 35, gi: 78, fiber: 1, sugar: 6 },
  { id: 21, name: "Meat Pie (1 piece)", category: "pastry", carbs: 40, gi: 70, fiber: 1, sugar: 8 },
  { id: 22, name: "Chin Chin (1 cup)", category: "pastry", carbs: 55, gi: 72, fiber: 2, sugar: 15 },
  
  // Pasta
  { id: 23, name: "Spaghetti (1 cup cooked)", category: "pasta", carbs: 43, gi: 58, fiber: 2.5, sugar: 1 },
  { id: 24, name: "Indomie (1 pack)", category: "pasta", carbs: 56, gi: 61, fiber: 2, sugar: 3 },
];
src/data/trivia.js
javascriptexport const TRIVIA = [
  {
    q: "Which has more carbs: 1 cup of beans or 1 Coca-Cola?",
    a: "Beans (40g vs 39g) – but beans have 13g fiber and zero sugar!",
  },
  {
    q: "True or False: Liquid sugar absorbs faster than solid sugar.",
    a: "TRUE! Sodas spike your blood sugar in under 15 minutes.",
  },
  {
    q: "Which has a higher glycemic index: white rice or brown rice?",
    a: "White rice (73 vs 68). Brown rice digests slower due to fiber.",
  },
  {
    q: "How long does a sugar crash typically last after drinking soda?",
    a: "1-2 hours. That's why you feel tired mid-afternoon!",
  },
  {
    q: "What's the glycemic index of beans?",
    a: "Only 29! Beans are one of the slowest-digesting carbs.",
  },
  {
    q: "If you drink 1 Coke per day, how much sugar in a year?",
    a: "14.2kg of pure sugar. That's like eating 71 bags of sugar!",
  },
  {
    q: "Which Nigerian swallow has the most fiber?",
    a: "Amala (5g per wrap) – fiber slows glucose absorption.",
  },
  {
    q: "True or False: Eating carbs at night makes you gain more fat.",
    a: "MYTH! Total daily calories matter more than timing.",
  },
  {
    q: "What does 'glycemic index' measure?",
    a: "How fast a food raises your blood sugar (0-100 scale).",
  },
  {
    q: "Which is better pre-workout: yam or white bread?",
    a: "Yam (GI 54 vs 75). Steady energy > quick spike + crash.",
  },
];

🧮 src/utils/calculator.js
javascript// Calculate glycemic load (GI × carbs / 100)
export const calcGlycemicLoad = (gi, carbs) => {
  return (gi * carbs) / 100;
};

// Calculate daily stats from food log
export const calcDailyStats = (foodLog) => {
  const totals = foodLog.reduce(
    (acc, entry) => {
      const food = entry.food;
      const qty = entry.quantity || 1;
      
      return {
        carbs: acc.carbs + food.carbs * qty,
        sugar: acc.sugar + food.sugar * qty,
        fiber: acc.fiber + food.fiber * qty,
        glycemicLoad: acc.glycemicLoad + calcGlycemicLoad(food.gi, food.carbs * qty),
      };
    },
    { carbs: 0, sugar: 0, fiber: 0, glycemicLoad: 0 }
  );

  // Quality score (0-100): favor fiber, penalize high GL
  const qualityScore = Math.max(
    0,
    Math.min(100, 100 - totals.glycemicLoad + totals.fiber * 2)
  );

  // Insulin strain (0-100): based on glycemic load
  const insulinStrain = Math.min(100, (totals.glycemicLoad / 150) * 100);

  // Energy stability (0-100): inverse of GL variance
  const energyStability = Math.max(0, 100 - insulinStrain);

  return {
    ...totals,
    qualityScore: Math.round(qualityScore),
    insulinStrain: Math.round(insulinStrain),
    energyStability: Math.round(energyStability),
  };
};

// Project yearly impact
export const projectYearly = (dailyStats) => {
  return {
    sugarKg: (dailyStats.sugar * 365) / 1000,
    totalCarbs: dailyStats.carbs * 365,
    avgInsulinStrain: dailyStats.insulinStrain,
  };
};

// Get color for metric
export const getMetricColor = (value, inverse = false) => {
  if (inverse) value = 100 - value;
  if (value >= 70) return "#10b981"; // green
  if (value >= 40) return "#f59e0b"; // orange
  return "#ef4444"; // red
};

🎨 src/components/FoodLogger.jsx
jsximport { useState } from 'react';
import { FOODS } from '../data/foods';

export default function FoodLogger({ onAdd }) {
  const [selected, setSelected] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    
    const food = FOODS.find(f => f.id === parseInt(selected));
    onAdd({ food, quantity, time: new Date() });
    
    setSelected('');
    setQuantity(1);
  };

  return (
    <div className="card">
      <h2>🍽️ Log Your Food</h2>
      <form onSubmit={handleSubmit} className="logger-form">
        <select 
          value={selected} 
          onChange={(e) => setSelected(e.target.value)}
          required
        >
          <option value="">Select food...</option>
          {FOODS.map(f => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        
        <input 
          type="number" 
          min="0.5" 
          step="0.5" 
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value))}
          placeholder="Qty"
        />
        
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

📊 src/components/Dashboard.jsx
jsximport { calcDailyStats, projectYearly, getMetricColor } from '../utils/calculator';

export default function Dashboard({ foodLog }) {
  if (foodLog.length === 0) {
    return (
      <div className="card">
        <p className="empty-state">Log your first meal to see your stats! 👆</p>
      </div>
    );
  }

  const stats = calcDailyStats(foodLog);
  const yearly = projectYearly(stats);

  return (
    <div className="dashboard">
      <div className="metric-grid">
        <MetricCard
          label="Carb Quality"
          value={stats.qualityScore}
          suffix="/100"
          color={getMetricColor(stats.qualityScore)}
        />
        <MetricCard
          label="Energy Stability"
          value={stats.energyStability}
          suffix="%"
          color={getMetricColor(stats.energyStability)}
        />
        <MetricCard
          label="Insulin Strain"
          value={stats.insulinStrain}
          suffix="%"
          color={getMetricColor(stats.insulinStrain, true)}
        />
      </div>

      <div className="card projection">
        <h3>📈 1-Year Projection</h3>
        <div className="projection-stat">
          <span className="big-number">{yearly.sugarKg.toFixed(1)}kg</span>
          <span className="label">Sugar consumed per year</span>
        </div>
        <div className="projection-stat">
          <span className="big-number">{(yearly.totalCarbs / 1000).toFixed(1)}kg</span>
          <span className="label">Total carbs per year</span>
        </div>
      </div>

      <div className="card food-log">
        <h3>Today's Log</h3>
        {foodLog.map((entry, i) => (
          <div key={i} className="log-item">
            <span>{entry.food.name}</span>
            <span className="qty">×{entry.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCard({ label, value, suffix, color }) {
  return (
    <div className="metric-card" style={{ borderColor: color }}>
      <div className="metric-value" style={{ color }}>
        {value}{suffix}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );
}

🎮 src/components/TriviaPopup.jsx
jsximport { useState, useEffect } from 'react';
import { TRIVIA } from '../data/trivia';

export default function TriviaPopup({ onClose }) {
  const [current, setCurrent] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const random = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];
    setCurrent(random);
  }, []);

  if (!current) return null;

  return (
    <div className="trivia-overlay" onClick={onClose}>
      <div className="trivia-card" onClick={(e) => e.stopPropagation()}>
        <h3>💡 Did You Know?</h3>
        <p className="trivia-question">{current.q}</p>
        
        {!showAnswer ? (
          <button onClick={() => setShowAnswer(true)}>Show Answer</button>
        ) : (
          <div className="trivia-answer">
            <p>{current.a}</p>
            <button onClick={onClose}>Got it!</button>
          </div>
        )}
      </div>
    </div>
  );
}

🎯 src/App.jsx
jsximport { useState, useEffect } from 'react';
import FoodLogger from './components/FoodLogger';
import Dashboard from './components/Dashboard';
import TriviaPopup from './components/TriviaPopup';

export default function App() {
  const [foodLog, setFoodLog] = useState([]);
  const [showTrivia, setShowTrivia] = useState(false);
  const [streak, setStreak] = useState(0);

  // Show trivia after 3 items logged
  useEffect(() => {
    if (foodLog.length > 0 && foodLog.length % 3 === 0) {
      setShowTrivia(true);
    }
  }, [foodLog.length]);

  const handleAddFood = (entry) => {
    setFoodLog([...foodLog, entry]);
    setStreak(streak + 1);
  };

  return (
    <div className="app">
      <header>
        <h1>🧠 CarbHEALTH</h1>
        <p className="tagline">Your Metabolic Intelligence Platform</p>
        {streak > 0 && (
          <div className="streak">🔥 {streak} items logged today</div>
        )}
      </header>

      <main>
        <FoodLogger onAdd={handleAddFood} />
        <Dashboard foodLog={foodLog} />
      </main>

      {showTrivia && <TriviaPopup onClose={() => setShowTrivia(false)} />}
    </div>
  );
}

🎨 src/index.css
css* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.app {
  max-width: 800px;
  margin: 0 auto;
}

header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

header h1 {
  font-size: 3rem;
  margin-bottom: 5px;
}

.tagline {
  font-size: 1.1rem;
  opacity: 0.9;
}

.streak {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 20px;
  margin-top: 10px;
  font-weight: 600;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.logger-form {
  display: flex;
  gap: 10px;
}

.logger-form select,
.logger-form input,
.logger-form button {
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
}

.logger-form select {
  flex: 2;
}

.logger-form input {
  flex: 0 0 80px;
}

.logger-form button {
  flex: 0 0 100px;
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.logger-form button:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

.empty-state {
  text-align: center;
  color: #6b7280;
  font-size: 1.1rem;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.metric-card {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid;
  text-align: center;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.metric-label {
  color: #6b7280;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.projection {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.projection h3 {
  margin-bottom: 20px;
}

.projection-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px 0;
}

.big-number {
  font-size: 3rem;
  font-weight: 700;
}

.label {
  opacity: 0.9;
  font-size: 0.9rem;
}

.food-log {
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.log-item:last-child {
  border-bottom: none;
}

.qty {
  color: #667eea;
  font-weight: 600;
}

.trivia-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.trivia-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 500px;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.trivia-card h3 {
  color: #667eea;
  margin-bottom: 16px;
  font-size: 1.5rem;
}

.trivia-question {
  font-size: 1.2rem;
  margin-bottom: 20px;
  line-height: 1.6;
}

.trivia-answer {
  background: #f0fdf4;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #10b981;
}

.trivia-answer p {
  margin-bottom: 16px;
  color: #065f46;
}

.trivia-card button {
  width: 100%;
  padding: 14px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.trivia-card button:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

⚡ Quick Start Commands
bashnpm create vite@latest carbhealth -- --template react
cd carbhealth
npm install
npm run dev
Then:

Replace src/App.jsx with above