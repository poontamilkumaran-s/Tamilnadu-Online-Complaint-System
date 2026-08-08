import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, onRate = null, readOnly = false, size = 18 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (val) => {
    if (!readOnly && onRate) setHoverRating(val);
  };

  const handleMouseLeave = () => {
    if (!readOnly && onRate) setHoverRating(0);
  };

  const handleClick = (val) => {
    if (!readOnly && onRate) onRate(val);
  };

  const currentRating = hoverRating || rating;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= currentRating;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(star)}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: readOnly ? 'default' : 'pointer',
              color: isFilled ? '#fbbf24' : '#4b5563',
              transition: 'transform 0.15s ease, color 0.15s ease',
              transform: isFilled && !readOnly ? 'scale(1.15)' : 'scale(1)',
            }}
          >
            <Star size={size} fill={isFilled ? '#fbbf24' : 'none'} />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
