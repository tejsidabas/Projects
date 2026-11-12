import React, { useState } from 'react';
import BookingCard from '../components/BookingCard.jsx';

export default function BookingsPage({
  bookings,
  user,
  onCancel,
  onPay,
  onAttendance,
  onReplace,
  onOpenReview,
  onNavigate
}) {
  const [filter, setFilter] = useState('All');

  // Filters visible bookings according to selected tab status
  const filteredBookings = bookings.filter((b) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return ['Confirmed', 'In Progress'].includes(b.status);
    if (filter === 'Completed') return b.status === 'Completed';
    if (filter === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  return (
    <section className="page-frame">
      <div className="page-heading">
        <span className="eyebrow">YOUR BOOKINGS</span>
        <h1>Service Appointments & History</h1>
        <p>
          Manage your domestic service bookings, record arrival attendance, verify payments,
          and rate completed work.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['All', 'Active', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            className={`btn btn-small ${filter === tab ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="booking-list">
        {filteredBookings.map((b) => (
          <BookingCard
            key={b.id}
            booking={b}
            user={user}
            onCancel={onCancel}
            onPay={onPay}
            onAttendance={onAttendance}
            onReplace={onReplace}
            onOpenReview={onOpenReview}
          />
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="empty-state">
          <span>▤</span>
          <h3>No bookings found</h3>
          <p>
            {filter === 'All'
              ? 'You have not booked any household services yet.'
              : `No bookings in '${filter}' status.`}
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('services')}>
            Explore Services
          </button>
        </div>
      )}
    </section>
  );
}
