import React, { useState, useEffect } from 'react';
import BookingCard from '../components/BookingCard.jsx';
import { api } from '../services/api.js';

export default function DashboardPage({
  user,
  bookings,
  onNavigate,
  onCancelBooking,
  onPayBooking,
  onAttendanceBooking,
  onReplaceBooking,
  onOpenReview,
  onOpenUrgent,
  onToggleAvailability,
  onShowNotice
}) {
  const [adminSummary, setAdminSummary] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  useEffect(() => {
    if (user?.role === 'Admin') {
      loadAdminData();
    }
  }, [user?.role]);

  async function loadAdminData() {
    setLoadingAdmin(true);
    try {
      const summary = await api.getAdminSummary();
      const users = await api.getAdminUsers();
      setAdminSummary(summary);
      setAdminUsers(users);
    } catch (err) {
      onShowNotice(err.message);
    } finally {
      setLoadingAdmin(false);
    }
  }

  async function handleToggleVerify(helperId, currentStatus) {
    try {
      await api.verifyHelper(helperId, !currentStatus);
      onShowNotice(`Helper status updated to ${!currentStatus ? 'Verified' : 'Unverified'}.`);
      loadAdminData();
    } catch (err) {
      onShowNotice(err.message);
    }
  }

  if (!user) {
    return (
      <section className="page-frame">
        <div className="empty-state">
          <span>⌂</span>
          <h3>Please Log In</h3>
          <p>You need to be signed in to view your dashboard.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('auth', { mode: 'login' })}>
            Log In Now
          </button>
        </div>
      </section>
    );
  }

  // --- 1. ADMIN DASHBOARD ---
  if (user.role === 'Admin') {
    const metrics = adminSummary?.metrics || {};
    const helpersList = adminUsers.filter((u) => u.role === 'Helper');

    return (
      <section className="page-frame">
        <div className="page-heading">
          <span className="eyebrow">ADMINISTRATOR CONTROL CONSOLE</span>
          <h1>Admin Management Portal</h1>
          <p>
            Oversee household users, helper verifications, booking transactions, and platform metrics.
          </p>
        </div>

        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <h3>Admin Portal</h3>
            <button className="active">▦ Overview & Metrics</button>
            <button onClick={() => onNavigate('bookings')}>▤ All Bookings</button>
            <button onClick={() => onNavigate('helpers')}>♧ Helpers Catalog</button>
            <button onClick={() => onNavigate('services')}>✳ Services</button>
          </aside>

          <div className="dashboard-content">
            <div className="metric-grid">
              <div className="metric-card">
                <span>⌂</span>
                <strong>{metrics.householdsCount ?? '0'}</strong>
                <small>Households Registered</small>
              </div>

              <div className="metric-card">
                <span>♧</span>
                <strong>{metrics.helpersCount ?? '0'}</strong>
                <small>Total Helpers ({metrics.verifiedHelpersCount || 0} Verified)</small>
              </div>

              <div className="metric-card">
                <span>▤</span>
                <strong>{metrics.totalBookings ?? bookings.length}</strong>
                <small>Total Bookings</small>
              </div>

              <div className="metric-card">
                <span>₹</span>
                <strong>₹{Number(metrics.totalRevenue || 0).toLocaleString('en-IN')}</strong>
                <small>Recorded Platform Revenue</small>
              </div>

              <div className="metric-card">
                <span>★</span>
                <strong>{metrics.averageRating || '5.0'} / 5.0</strong>
                <small>Average Service Rating</small>
              </div>

              <div className="metric-card">
                <span>⏳</span>
                <strong>{metrics.activeBookings ?? '0'}</strong>
                <small>Active Jobs In Progress</small>
              </div>
            </div>

            {/* Helper Verification Table */}
            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Helper Verification & Quality Management</h3>
                  <p>Verify helper background and skill credentials before allocation.</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Helper Name</th>
                      <th>Area / Locality</th>
                      <th>Skills</th>
                      <th>Experience</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Verification Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {helpersList.map((h) => (
                      <tr key={h.id}>
                        <td><strong>{h.name}</strong></td>
                        <td>{h.area || 'Delhi NCR'}</td>
                        <td>{(h.skills || []).join(', ')}</td>
                        <td>{h.experience || 1} yrs</td>
                        <td>★ {h.rating || 5.0}</td>
                        <td>
                          <span className={`pill ${h.verified ? 'green-pill' : ''}`}>
                            {h.verified ? '✓ Verified' : 'Pending Review'}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`btn btn-small ${h.verified ? 'btn-outline' : 'btn-primary'}`}
                            onClick={() => handleToggleVerify(h.id, h.verified)}
                          >
                            {h.verified ? 'Revoke Status' : 'Approve & Verify'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Bookings Feed */}
            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Recent Platform Bookings</h3>
                  <p>Real-time booking and scheduling activity.</p>
                </div>
                <button className="text-link" onClick={() => onNavigate('bookings')}>
                  View all bookings →
                </button>
              </div>

              <div className="booking-list">
                {bookings.slice(0, 5).map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    user={user}
                    onCancel={onCancelBooking}
                    onPay={onPayBooking}
                    onAttendance={onAttendanceBooking}
                    onReplace={onReplaceBooking}
                    onOpenReview={onOpenReview}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- 2. HELPER DASHBOARD ---
  if (user.role === 'Helper') {
    const upcoming = bookings.filter((b) => b.status === 'Confirmed');
    const inProgress = bookings.filter((b) => b.status === 'In Progress');
    const completed = bookings.filter((b) => b.status === 'Completed');
    // Sums earned amounts from paid completed bookings
    const totalEarnings = completed
      .filter((b) => b.paymentStatus === 'Paid')
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

    return (
      <section className="page-frame">
        <div className="page-heading">
          <span className="eyebrow">HELPER WORKSPACE</span>
          <h1>Welcome, {user.name.split(' ')[0]}!</h1>
          <p>
            Manage your daily household bookings, record check-in/out attendance, and track earnings.
          </p>
        </div>

        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <h3>Helper Menu</h3>
            <button className="active">▦ Dashboard</button>
            <button onClick={() => onNavigate('bookings')}>▤ My Bookings ({bookings.length})</button>
            <button onClick={() => onNavigate('contact')}>☏ Support</button>
          </aside>

          <div className="dashboard-content">
            <div className="availability-banner">
              <div>
                <strong>Active Availability Status</strong>
                <p>
                  {user.available !== false
                    ? 'You are marked Available. Households can assign you for bookings.'
                    : 'You are marked Unavailable. No new bookings will be scheduled.'}
                </p>
              </div>
              <button
                className={`btn ${user.available !== false ? 'btn-outline' : 'btn-primary'}`}
                onClick={() => onToggleAvailability(user.available === false)}
              >
                Set {user.available !== false ? 'Unavailable' : 'Available'}
              </button>
            </div>

            <div className="metric-grid">
              <div className="metric-card">
                <span>▤</span>
                <strong>{bookings.length}</strong>
                <small>Total Bookings Assigned</small>
              </div>

              <div className="metric-card">
                <span>◷</span>
                <strong>{upcoming.length + inProgress.length}</strong>
                <small>Active & Upcoming Jobs</small>
              </div>

              <div className="metric-card">
                <span>✓</span>
                <strong>{completed.length}</strong>
                <small>Completed Jobs</small>
              </div>

              <div className="metric-card">
                <span>₹</span>
                <strong>₹{totalEarnings.toLocaleString('en-IN')}</strong>
                <small>Confirmed Earnings</small>
              </div>

              <div className="metric-card">
                <span>★</span>
                <strong>{user.rating || 5.0} / 5.0</strong>
                <small>Average Household Rating</small>
              </div>
            </div>

            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Your Work Schedule</h3>
                  <p>Click "Check In" when reaching the household and "Check Out" once finished.</p>
                </div>
              </div>

              <div className="booking-list">
                {bookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    user={user}
                    onCancel={onCancelBooking}
                    onPay={onPayBooking}
                    onAttendance={onAttendanceBooking}
                    onReplace={onReplaceBooking}
                    onOpenReview={onOpenReview}
                  />
                ))}
              </div>

              {bookings.length === 0 && (
                <div className="empty-state">
                  <span>▤</span>
                  <h3>No bookings scheduled</h3>
                  <p>Your work requests will appear here once households book your services.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- 3. HOUSEHOLD DASHBOARD ---
  const activeBookings = bookings.filter((b) => ['Confirmed', 'In Progress'].includes(b.status));
  const pastBookings = bookings.filter((b) => b.status === 'Completed');
  // Calculates total expenses on completed services
  const totalSpent = pastBookings
    .filter((b) => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  return (
    <section className="page-frame">
      <div className="page-heading">
        <span className="eyebrow">HOUSEHOLD DASHBOARD</span>
        <h1>Welcome, {user.name.split(' ')[0]}!</h1>
        <p>
          View your upcoming home services, verify attendance, process payments, and rate helpers.
        </p>
      </div>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <h3>Household Space</h3>
          <button className="active">▦ Dashboard</button>
          <button onClick={() => onNavigate('bookings')}>▤ My Bookings ({bookings.length})</button>
          <button onClick={() => onNavigate('services')}>✳ Book a Service</button>
          <button onClick={() => onNavigate('helpers')}>♧ Find Helpers</button>
          <button onClick={() => onNavigate('contact')}>☏ Support</button>
        </aside>

        <div className="dashboard-content">
          <div className="metric-grid">
            <div className="metric-card">
              <span>▤</span>
              <strong>{bookings.length}</strong>
              <small>Total Bookings</small>
            </div>

            <div className="metric-card">
              <span>◷</span>
              <strong>{activeBookings.length}</strong>
              <small>Upcoming / In Progress</small>
            </div>

            <div className="metric-card">
              <span>✓</span>
              <strong>{pastBookings.length}</strong>
              <small>Completed Services</small>
            </div>

            <div className="metric-card">
              <span>₹</span>
              <strong>₹{totalSpent.toLocaleString('en-IN')}</strong>
              <small>Total Spent (Recorded)</small>
            </div>
          </div>

          <div className="dashboard-promo">
            <div>
              <span className="eyebrow">URGENT HOUSEHOLD ASSISTANCE</span>
              <h3>Need someone right away?</h3>
              <p>
                Our rule-based smart allocation engine automatically finds the nearest available
                domestic helper with zero booking conflicts.
              </p>
              <button className="btn btn-primary btn-small" onClick={onOpenUrgent}>
                ⚡ Request Urgent Dispatch
              </button>
            </div>
            <span className="promo-emoji">🏡</span>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div>
                <h3>Upcoming & Recent Bookings</h3>
                <p>Track service progress, attendance, and leave ratings.</p>
              </div>
              <button className="text-link" onClick={() => onNavigate('bookings')}>
                View all bookings →
              </button>
            </div>

            <div className="booking-list">
              {bookings.slice(0, 4).map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  user={user}
                  onCancel={onCancelBooking}
                  onPay={onPayBooking}
                  onAttendance={onAttendanceBooking}
                  onReplace={onReplaceBooking}
                  onOpenReview={onOpenReview}
                />
              ))}
            </div>

            {bookings.length === 0 && (
              <div className="empty-state">
                <span>⌂</span>
                <h3>No service bookings yet</h3>
                <p>Book trusted domestic help for cleaning, cooking, laundry, and more.</p>
                <button className="btn btn-primary" onClick={() => onNavigate('services')}>
                  Explore Services
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
