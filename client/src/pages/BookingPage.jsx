import React, { useState } from 'react';

export default function BookingPage({
  helper,
  services,
  user,
  onCreateBooking,
  onOpenSmartMatch,
  onNavigate
}) {
  const defaultService = services[0];
  const [selectedServiceId, setSelectedServiceId] = useState(defaultService?.id || 'cleaning');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState('2');
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

  const activeService = services.find((s) => s.id === selectedServiceId) || defaultService;
  // Hourly rate precedence: helper's custom rate or service base price
  const hourlyRate = Number(helper?.rate) || Number(activeService?.price) || 200;
  const totalAmount = hourlyRate * Number(duration);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      onNavigate('auth', { mode: 'login' });
      return;
    }

    if (!helper) {
      alert('Please select a helper first.');
      return;
    }

    setLoading(true);
    try {
      await onCreateBooking({
        serviceId: activeService.id,
        helperId: helper.id,
        date,
        time,
        duration: Number(duration),
        address,
        notes,
        paymentMethod
      });
    } finally {
      setLoading(false);
    }
  }

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  return (
    <section className="page-frame">
      <div className="page-heading">
        <span className="eyebrow">MAKE IT OFFICIAL</span>
        <h1>Book Household Service</h1>
        <p>
          Select date and time. Sahayata validates worker availability and booking conflicts automatically.
        </p>
      </div>

      <div className="booking-layout">
        <form className="panel booking-form" onSubmit={handleSubmit}>
          {helper ? (
            <div className="selected-helper">
              <div className="avatar large-avatar">
                {helper.name ? helper.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'H'}
              </div>
              <div>
                <strong>{helper.name} {helper.verified && '✓'}</strong>
                <small>★ {helper.rating || 5.0} · {helper.area || 'Delhi NCR'}</small>
              </div>
              <strong className="price-label">₹{hourlyRate}/hr</strong>
            </div>
          ) : (
            <div style={{ padding: '10px 0', borderBottom: '1px solid #f0ecf0' }}>
              <p className="muted" style={{ margin: 0 }}>No specific helper selected.</p>
              <button
                type="button"
                className="text-link"
                onClick={() => onNavigate('helpers')}
              >
                Browse helpers list →
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700' }}>Want to see algorithmic recommendations?</span>
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={() => onOpenSmartMatch({
                serviceName: activeService.name,
                date,
                time,
                duration: Number(duration),
                address
              })}
            >
              ⚖ Smart Match Analysis
            </button>
          </div>

          <div className="form-row">
            <label>
              Service Category
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                required
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.name} — ₹{s.price}/hr
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
                <option value="1">1 Hour</option>
                <option value="2">2 Hours (Standard)</option>
                <option value="3">3 Hours</option>
                <option value="4">4 Hours (Deep Clean)</option>
              </select>
            </label>
          </div>

          <div className="form-row">
            <label>
              Date
              <input
                type="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <label>
              Time Slot
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Household Service Address
            <textarea
              required
              rows="2"
              placeholder="Flat/House number, Street, Locality, Landmark"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <div className="form-row">
            <label>
              Payment Method
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Cash">Cash on Service</option>
                <option value="Card">Debit / Credit Card</option>
              </select>
            </label>

            <label>
              Special Instructions (Optional)
              <input
                placeholder="e.g. Bring cleaning supplies, Ring bell twice"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
          </div>

          <button className="btn btn-primary full" disabled={loading}>
            {loading ? 'Validating Conflicts & Booking…' : 'Confirm & Reserve Slot →'}
          </button>
        </form>

        <aside className="panel summary-panel">
          <h3>Booking Summary</h3>

          <div className="summary-service">
            <span className={`service-icon ${activeService?.color || 'pink'}`}>
              {activeService?.icon || '⌂'}
            </span>
            <div>
              <strong>{activeService?.name}</strong>
              <small>Slot: {date} @ {time}</small>
            </div>
          </div>

          <div className="summary-line">
            <span>Hourly Rate</span>
            <strong>₹{hourlyRate}</strong>
          </div>

          <div className="summary-line">
            <span>Duration</span>
            <strong>{duration} hours</strong>
          </div>

          <div className="summary-line">
            <span>Platform Convenience Fee</span>
            <strong>₹0 (Free)</strong>
          </div>

          <div className="summary-line total">
            <span>Total Estimated</span>
            <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
          </div>

          <p className="muted tiny-text">
            No upfront deduction in academic demo. Payment is confirmed upon completion of service.
          </p>
        </aside>
      </div>
    </section>
  );
}
