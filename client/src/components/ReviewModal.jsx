import React, { useState } from 'react';

export default function ReviewModal({ isOpen, onClose, booking, onSubmitReview }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !booking) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmitReview(booking.id, { rating, comment });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Rate & Review Service</h3>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>
              Share your feedback for <strong>{booking.helperName}</strong> ({booking.serviceName})
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label style={{ textAlign: 'center' }}>
            Your Rating
            <div className="star-rating-input" style={{ justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating ? 'active' : ''}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <strong style={{ fontSize: '14px', color: '#202235' }}>
              {rating} of 5 Stars
            </strong>
          </label>

          <label>
            Your Feedback
            <textarea
              required
              rows="3"
              placeholder="How was the service quality, punctuality, and overall help?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>

          <button className="btn btn-primary full" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
