import React from 'react';

export default function HelperProfilePage({ helper, services, onBook, onNavigate }) {
  if (!helper) {
    return (
      <section className="page-frame">
        <div className="empty-state">
          <span>♧</span>
          <h3>No Helper Selected</h3>
          <p>Please browse our helpers list to view a profile.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('helpers')}>
            View Helpers
          </button>
        </div>
      </section>
    );
  }

  const initials = helper.name
    ? helper.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'H';

  return (
    <section className="page-frame">
      <div className="page-heading">
        <span className="eyebrow">HELPER PROFILE</span>
        <h1>Get to Know {helper.name}</h1>
        <p>Review skills, credentials, experience, and past household feedback.</p>
      </div>

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar">{initials}</div>
          <h2>{helper.name}</h2>
          <p className="muted">📍 {helper.area || 'Delhi NCR'}</p>

          <div className="rating-line" style={{ justifyContent: 'center' }}>
            <span className="stars">★★★★★</span>
            <strong>{helper.rating || 5.0}</strong>
            <span className="muted">({helper.reviews || 0} reviews)</span>
          </div>

          <div className="pills">
            <span className={`pill ${helper.verified ? 'green-pill' : ''}`}>
              {helper.verified ? '✓ Verified Helper' : 'Profile Under Review'}
            </span>
            <span className={`pill ${helper.available !== false ? 'green-pill' : ''}`}>
              ● {helper.available !== false ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <button
            className="btn btn-primary full"
            onClick={() => onBook(helper)}
          >
            Book this helper →
          </button>
        </div>

        <div className="profile-details">
          <div className="panel">
            <h3>About {helper.name.split(' ')[0]}</h3>
            <p>
              {helper.bio ||
                'Experienced and dedicated household helper committed to reliable, respectful service.'}
            </p>

            <div className="stat-row">
              <div>
                <strong>{helper.experience || 1}+</strong>
                <small>Years experience</small>
              </div>
              <div>
                <strong>{helper.reviews || 0}</strong>
                <small>Customer reviews</small>
              </div>
              <div>
                <strong>₹{helper.rate || 200}/hr</strong>
                <small>Standard hourly rate</small>
              </div>
            </div>
          </div>

          <div className="panel">
            <h3>Services Offered</h3>
            <div className="skill-pills">
              {(helper.skills || []).map((skill) => (
                <span key={skill} className="skill-pill" style={{ padding: '8px 12px', fontSize: '11px' }}>
                  {skill}
                </span>
              ))}
            </div>

            <h3 className="mt">Weekly Availability</h3>
            <div className="availability-row">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>

          {Array.isArray(helper.reviewsList) && helper.reviewsList.length > 0 && (
            <div className="panel">
              <h3>Verified Household Reviews</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {helper.reviewsList.map((rev) => (
                  <div key={rev.id} style={{ borderBottom: '1px solid #f0ecf0', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <strong>{rev.userName}</strong>
                      <span style={{ color: '#ffad34' }}>{'★'.repeat(rev.rating)}</span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#555365' }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
