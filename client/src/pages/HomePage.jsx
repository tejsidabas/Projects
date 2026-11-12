import React, { useState } from 'react';
import ServiceCard from '../components/ServiceCard.jsx';
import HelperCard from '../components/HelperCard.jsx';

export default function HomePage({
  services,
  helpers,
  onNavigate,
  onSelectService,
  onSelectHelper,
  onOpenUrgent
}) {
  const [searchTerm, setSearchTerm] = useState('');

  function handleSearchSubmit(e) {
    e.preventDefault();
    onNavigate('helpers', { search: searchTerm });
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span>✦</span> TRUSTED · TRANSPARENT · CONVENIENT
          </span>

          <h1>
            Good help makes<br />
            <em>home feel better.</em>
          </h1>

          <p>
            Connect with verified household helpers for cleaning, cooking, laundry, and daily care.
            Slot-based scheduling with automated conflict-free matching.
          </p>

          <form className="hero-search" onSubmit={handleSearchSubmit}>
            <span>⌕</span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search helper name, skill, or area (e.g. Rohini)..."
            />
            <button className="btn btn-primary" type="submit">
              Find help <span>→</span>
            </button>
          </form>

          <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-quiet btn-small" onClick={onOpenUrgent}>
              ⚡ Need Help Now? Urgent Dispatch
            </button>
          </div>

          <div className="hero-proof">
            <div className="avatar-stack">
              <span className="avatar a1">P</span>
              <span className="avatar a2">S</span>
              <span className="avatar a3">A</span>
            </div>
            <div>
              <strong>Trusted by local households</strong>
              <small>
                <span className="stars">★★★★★</span> 4.8 average helper rating
              </small>
            </div>
          </div>
        </div>

        <div className="hero-art">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1100&q=85"
            alt="Household professional helping at home"
          />
          <div className="hero-image-wash" />
          <div className="floating-card">
            <span className="float-icon">✓</span>
            <div>
              <strong>Verified helpers</strong>
              <small>Admin reviewed profiles</small>
            </div>
          </div>
          <div className="floating-rating">
            <span>★</span>
            <div>
              <strong>4.8/5</strong>
              <small>Customer rating</small>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div>
          <span className="trust-icon pink">♧</span>
          <div>
            <strong>Verified Profiles</strong>
            <small>Admin-approved helpers</small>
          </div>
        </div>
        <div>
          <span className="trust-icon yellow">◷</span>
          <div>
            <strong>Slot-Based Booking</strong>
            <small>Conflict-free scheduling</small>
          </div>
        </div>
        <div>
          <span className="trust-icon violet">♡</span>
          <div>
            <strong>Smart Allocation</strong>
            <small>Ranked by rating & distance</small>
          </div>
        </div>
        <div>
          <span className="trust-icon mint">✓</span>
          <div>
            <strong>Clear Pricing</strong>
            <small>Hourly transparent rates</small>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A LITTLE HELP GOES A LONG WAY</span>
            <h2>Household Services</h2>
            <p>Everyday services tailored to your household routine.</p>
          </div>
          <button className="text-link" onClick={() => onNavigate('services')}>
            Explore all services <span>→</span>
          </button>
        </div>

        <div className="service-grid">
          {services.slice(0, 6).map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={(s) => {
                onSelectService(s);
                onNavigate('helpers', { service: s.name });
              }}
            />
          ))}
        </div>
      </section>

      <section className="section helper-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LOCAL PEOPLE, REAL CARE</span>
            <h2>Meet Your Helping Hands</h2>
            <p>Skilled, reliable helpers ready to assist in your neighborhood.</p>
          </div>
          <button className="text-link" onClick={() => onNavigate('helpers')}>
            View all helpers <span>→</span>
          </button>
        </div>

        <div className="helper-grid">
          {helpers.slice(0, 3).map((helper) => (
            <HelperCard
              key={helper.id}
              helper={helper}
              onSelect={(h) => {
                onSelectHelper(h);
                onNavigate('profile');
              }}
              onBook={(h) => {
                onSelectHelper(h);
                onNavigate('booking');
              }}
            />
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-spark">✳</div>
        <div>
          <span className="eyebrow">MCA MINOR PROJECT – I</span>
          <h2>Sahayata – Smart Help for Every Home</h2>
          <p>
            Experience a modern domestic service management platform featuring intelligent worker
            matching, attendance tracking, and automated replacement.
          </p>
        </div>
        <button className="btn btn-white" onClick={() => onNavigate('services')}>
          Explore Services <span>→</span>
        </button>
      </section>
    </>
  );
}
