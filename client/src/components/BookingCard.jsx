import React from 'react';

export default function BookingCard({
  booking,
  user,
  onCancel,
  onPay,
  onAttendance,
  onReplace,
  onOpenReview
}) {
  const isHousehold = user?.role === 'Household';
  const isHelper = user?.role === 'Helper';
  const isAdmin = user?.role === 'Admin';

  const isCompleted = booking.status === 'Completed';
  const isCancelled = booking.status === 'Cancelled';
  const isInProgress = booking.status === 'In Progress';
  const isConfirmed = booking.status === 'Confirmed';

  const formattedAmount = `₹${Number(booking.amount || 0).toLocaleString('en-IN')}`;

  return (
    <article className="booking-row">
      <span className="booking-icon">{booking.icon || '⌂'}</span>

      <div className="booking-main">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <h3>{booking.serviceName}</h3>
          {booking.matchScore && (
            <span className="match-score-badge" style={{ fontSize: '10px', padding: '2px 8px' }}>
              Match: {booking.matchScore}%
            </span>
          )}
        </div>

        <p>
          <strong>{isHelper ? `Household: ${booking.userName}` : `Helper: ${booking.helperName}`}</strong>
          {' · '}
          {booking.date} at {booking.time} ({booking.duration || 2} hrs)
        </p>

        <small className="muted">📍 {booking.address}</small>

        {booking.notes && (
          <small className="muted" style={{ fontStyle: 'italic', display: 'block', marginTop: '2px' }}>
            Note: {booking.notes}
          </small>
        )}

        {/* Displays attendance logs when available */}
        {(booking.checkInTime || booking.checkOutTime) && (
          <div style={{ marginTop: '6px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {booking.checkInTime && (
              <span className="attendance-tag">
                ▶ In: {new Date(booking.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            {booking.checkOutTime && (
              <span className="attendance-tag">
                ■ Out: {new Date(booking.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        )}

        {booking.review && (
          <div style={{ marginTop: '6px', fontSize: '11px', color: '#4a4959' }}>
            <span style={{ color: '#ffad34' }}>{'★'.repeat(booking.review.rating)}</span>{' '}
            <em>"{booking.review.comment}"</em>
          </div>
        )}
      </div>

      <div className="booking-price">
        <strong>{formattedAmount}</strong>

        <span className={`status ${booking.status.toLowerCase().replace(/\s+/g, '-')}`}>
          {booking.status}
        </span>

        <span className={`payment-status ${booking.paymentStatus === 'Paid' ? 'paid' : ''}`}>
          {booking.paymentStatus === 'Paid' ? `Paid (${booking.paymentMethod || 'UPI'})` : 'Payment Pending'}
        </span>
      </div>

      <div className="booking-actions">
        {/* Helper attendance actions */}
        {isHelper && isConfirmed && (
          <button
            className="btn btn-primary btn-small"
            onClick={() => onAttendance(booking.id, 'check-in')}
          >
            ✓ Check In
          </button>
        )}

        {(isHelper || isHousehold) && isInProgress && (
          <button
            className="btn btn-primary btn-small"
            onClick={() => onAttendance(booking.id, 'check-out')}
          >
            ✓ Check Out
          </button>
        )}

        {/* Payment action */}
        {isHousehold && booking.paymentStatus !== 'Paid' && !isCancelled && (
          <button
            className="btn btn-outline btn-small"
            onClick={() => onPay(booking.id)}
          >
            Mark Paid (Demo)
          </button>
        )}

        {/* Review action */}
        {isHousehold && isCompleted && !booking.review && (
          <button
            className="btn btn-primary btn-small"
            onClick={() => onOpenReview(booking)}
          >
            ★ Rate & Review
          </button>
        )}

        {/* Automatic replacement trigger */}
        {isHousehold && (isCancelled || isConfirmed) && (
          <button
            className="btn btn-outline btn-small"
            onClick={() => onReplace(booking.id)}
            title="Auto-search for another available helper"
          >
            🔄 Find Replacement
          </button>
        )}

        {/* Helper decline / replacement */}
        {isHelper && isConfirmed && (
          <button
            className="btn btn-quiet btn-small"
            onClick={() => onReplace(booking.id)}
            title="Pass to another helper"
          >
            Pass to Another Helper
          </button>
        )}

        {/* Cancellation */}
        {!isCancelled && !isCompleted && (
          <button
            className="btn btn-quiet btn-small"
            onClick={() => onCancel(booking.id)}
          >
            Cancel
          </button>
        )}
      </div>
    </article>
  );
}
