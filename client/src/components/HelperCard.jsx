import React from 'react';

const helperImages = {
  h1: 'photo-1580489944761-15a19d654956',
  h2: 'photo-1551836022-d5d88e9218df',
  h3: 'photo-1544005313-94ddf0286df2',
  h4: 'photo-1507003211169-0a1dd7228f2d'
};

export default function HelperCard({ helper, onSelect, onBook }) {
  const imageKey = helperImages[helper.id] || 'photo-1580489944761-15a19d654956';
  const photoUrl = `https://images.unsplash.com/${imageKey}?auto=format&fit=crop&w=500&h=450&q=80`;

  return (
    <article className="helper-card">
      <button className="helper-main" onClick={() => onSelect(helper)}>
        <div className="helper-photo">
          <img src={photoUrl} alt={helper.name} />
          {helper.available !== false && (
            <span className="online-dot" title="Available for bookings" />
          )}
        </div>

        <div className="helper-info">
          <div className="helper-name-row">
            <h3>{helper.name}</h3>
            {helper.verified && (
              <span className="verified-mark" title="Admin Verified Helper">
                ✓
              </span>
            )}
          </div>

          <div className="rating-line">
            <span className="stars">★★★★★</span>
            <strong>{helper.rating || 5.0}</strong>
            <span className="muted">({helper.reviews || 0} reviews)</span>
          </div>

          <p className="helper-location">⌖ {helper.area || 'Delhi NCR'}</p>

          <div className="skill-pills">
            {(helper.skills || []).slice(0, 3).map((skill) => (
              <span className="skill-pill" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </button>

      <div className="helper-card-bottom">
        <div>
          <strong>
            ₹{helper.rate || 200}
            <small>/hour</small>
          </strong>
          <small>{helper.experience || 1}+ years experience</small>
        </div>

        <button
          className="btn btn-primary btn-small"
          onClick={(e) => {
            e.stopPropagation();
            onBook(helper);
          }}
        >
          Book now
        </button>
      </div>
    </article>
  );
}
