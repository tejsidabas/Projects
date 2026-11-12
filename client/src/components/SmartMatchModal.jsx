import React from 'react';

export default function SmartMatchModal({ isOpen, onClose, candidates, onSelectHelper, serviceName }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Smart Worker Allocation</h3>
            <p className="muted" style={{ margin: '4px 0 0', fontSize: '12px' }}>
              Multi-criteria ranking for <strong>{serviceName}</strong> based on availability, rating, experience, proximity & workload.
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {candidates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <p>No available helpers found matching this slot without booking conflicts.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {candidates.map((helper, idx) => (
              <div className="match-card" key={helper.id}>
                <div className="match-header">
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px' }}>
                      #{idx + 1} {helper.name} {helper.verified && '✓'}
                    </h4>
                    <span className="muted" style={{ fontSize: '11px' }}>
                      📍 {helper.area} · ₹{helper.rate}/hr · {helper.experience} yrs exp
                    </span>
                  </div>

                  <span className="match-score-badge">
                    {helper.matchScore}% Match
                  </span>
                </div>

                {helper.matchBreakdown && (
                  <div className="match-factors">
                    <div>★ Rating Score: <strong>{helper.matchBreakdown.ratingScore}/30</strong></div>
                    <div>💼 Experience: <strong>{helper.matchBreakdown.experienceScore}/25</strong></div>
                    <div>📍 Location: <strong>{helper.matchBreakdown.locationScore}/25</strong></div>
                    <div>⚖ Workload Balance: <strong>{helper.matchBreakdown.workloadScore}/20</strong></div>
                  </div>
                )}

                <button
                  className="btn btn-primary btn-small full"
                  onClick={() => {
                    onSelectHelper(helper);
                    onClose();
                  }}
                >
                  Select {helper.name.split(' ')[0]} for Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
