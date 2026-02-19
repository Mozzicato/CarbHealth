import React, { useState, useRef } from 'react';
import { FOODS } from '../data/foods';

export default function FoodLogger({ onAdd }) {
  const [selected, setSelected] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('all');
  const selectRef = useRef(null);

  const filteredFoods = category === 'all'
    ? FOODS
    : FOODS.filter(f => f.category === category);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;

    const food = FOODS.find(f => f.id === parseInt(selected));
    onAdd({ food, quantity, time: new Date() });

    setSelected('');
    setQuantity(1);
    // focus back to select for quick-add
    selectRef.current?.focus();
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">🍽️</span>
        <h2 className="card-title">Log Your Food</h2>
        <span className="card-badge">Quick Add</span>
      </div>

      {/* CATEGORY FILTER */}
      <div className="form-group">
        <label className="form-label">Category</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'drink', 'staple', 'tuber', 'legume', 'bread'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className="btn-secondary"
              style={{
                flex: '0 0 auto',
                padding: '8px 16px',
                fontSize: '0.85rem',
                background: category === cat ? 'var(--primary)' : 'var(--bg-dark)',
                color: category === cat ? 'white' : 'var(--text-secondary)',
                border: category === cat ? 'none' : '2px solid var(--border)'
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="logger-form">
        <div className="form-group">
          <label className="form-label">Select Food</label>
          <select
            ref={selectRef}
            className="form-select"
            aria-label="Select food"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            required
          >
            <option value="">Choose from {filteredFoods.length} options...</option>
            {filteredFoods.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.carbs}g carbs)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Quantity</label>
          <div className="quantity-input-group">
            <button
              type="button"
              className="quantity-btn"
              aria-label="decrease-quantity"
              onClick={() => setQuantity(Math.max(0.5, Math.round((quantity - 0.5) * 10) / 10))}
            >
              −
            </button>
            <input
              aria-label="Quantity"
              type="number"
              className="form-input quantity-input"
              min="0.5"
              step="0.5"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
            />
            <button
              type="button"
              className="quantity-btn"
              aria-label="increase-quantity"
              onClick={() => setQuantity(Math.round((quantity + 0.5) * 10) / 10)}
            >
              +
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary"> 
          <span style={{ position: 'relative', zIndex: 1 }}>Add to Log</span>
        </button>
      </form>
    </div>
  );
}
