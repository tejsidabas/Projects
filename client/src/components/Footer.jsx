import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-main">
        <button className="brand footer-brand" onClick={() => onNavigate('home')}>
          <span className="brand-mark">⌂</span>
          <span>
            Sahayata
            <small>Smart Help for Every Home</small>
          </span>
        </button>

        <p>
          An automated household-help booking platform connecting households with vetted
          domestic helpers with slot-based scheduling and conflict-free allocation.
        </p>

        <div className="footer-links">
          <button onClick={() => onNavigate('home')}>Home</button>
          <button onClick={() => onNavigate('services')}>Services</button>
          <button onClick={() => onNavigate('helpers')}>Find Help</button>
          <button onClick={() => onNavigate('about')}>About Project</button>
          <button onClick={() => onNavigate('contact')}>Contact</button>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Sahayata · MCA Minor Project – I · JIMS (GGSIPU)
        </span>
        <span>
          Designed by <b>TEJSI</b> (Enrollment: 03814004426)
        </span>
      </div>
    </footer>
  );
}
