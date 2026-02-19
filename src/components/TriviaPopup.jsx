import { useState, useEffect } from 'react';
import { TRIVIA } from '../data/trivia';

export default function TriviaPopup({ onClose }) {
  const [current, setCurrent] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const random = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];
    setCurrent(random);
    const savedScore = localStorage.getItem('carbIQ') || 0;
    setScore(parseInt(savedScore, 10));
  }, []);

  const handleCorrect = () => {
    const newScore = score + 10;
    setScore(newScore);
    localStorage.setItem('carbIQ', newScore);
    setShowAnswer(true);
  };

  if (!current) return null;

  return (
    <div className="trivia-overlay" onClick={onClose}>
      <div className="trivia-card" onClick={(e) => e.stopPropagation()}>
        <div className="trivia-header">
          <span className="trivia-icon">💡</span>
          <h3>Carb IQ Quiz</h3>
          <span className="card-badge">Score: {score}</span>
        </div>
        
        <p className="trivia-question">{current.q}</p>
        
        {!showAnswer ? (
          <div className="trivia-buttons">
            <button onClick={handleCorrect} className="btn-primary">Show Answer</button>
            <button onClick={onClose} className="btn-secondary">Skip</button>
          </div>
        ) : (
          <div className="trivia-answer">
            <p>{current.a}</p>
            <button onClick={onClose} className="btn-primary">+10 Carb IQ Points!</button>
          </div>
        )}
      </div>
    </div>
  );
}
