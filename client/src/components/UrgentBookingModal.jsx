import React, { useState } from 'react';

export default function UrgentBookingModal({ isOpen, onClose, services, onConfirmUrgent, userAddress }) {
  const [serviceId, setServiceId] = useState(services[0]?.id || 'cleaning');
  const [address, setAddress] = useState(userAddress || '');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('2');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirmUrgent({
        serviceId,
        address,
        notes,
        duration: Number(duration)
      });
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
            <div className="urgent-badge">⚡ Need Help Now?</div>
            <h3 style={{ marginTop: '8px' }}>Fast Household Help Dispatch</h3>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>
              Sahayata's smart matching engine will immediately allocate the nearest and highest-rated helper.
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Required Service
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name} (₹{s.price}/hr)
                </option>
              ))}
            </select>
          </label>

          <label>
            Duration
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="1">1 Hour Quick Visit</option>
              <option value="2">2 Hours Standard Visit</option>
              <option value="3">3 Hours Detailed Work</option>
            </select>
          </label>

          <label>
            Household Address
            <textarea
              required
              rows="2"
              placeholder="Enter your house/flat number and locality"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <label>
            Urgent Notes
            <textarea
              rows="2"
              placeholder="e.g. Urgent cleaning needed before guests arrive"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <button className="btn btn-primary full" disabled={loading}>
            {loading ? 'Finding Best Match…' : '⚡ Allocate Best Helper Now'}
          </button>
        </form>
      </div>
    </div>
  );
}
