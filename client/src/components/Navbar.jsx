import React from 'react';

export default function Navbar({ currentPage, onNavigate, user, onLogout, onOpenUrgent }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate('home')}>
        <span className="brand-mark">⌂</span>
        <span>
          Sahayata
          <small>Smart Help for Every Home</small>
        </span>
      </button>

      <nav className="main-nav">
        <button
          className={currentPage === 'home' ? 'active-link' : ''}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        <button
          className={currentPage === 'services' ? 'active-link' : ''}
          onClick={() => onNavigate('services')}
        >
          Services
        </button>
        <button
          className={currentPage === 'helpers' ? 'active-link' : ''}
          onClick={() => onNavigate('helpers')}
        >
          Find Help
        </button>
        <button
          className={currentPage === 'about' ? 'active-link' : ''}
          onClick={() => onNavigate('about')}
        >
          About
        </button>
        <button
          className={currentPage === 'contact' ? 'active-link' : ''}
          onClick={() => onNavigate('contact')}
        >
          Contact
        </button>
      </nav>

      <div className="nav-actions">
        {user?.role === 'Household' && (
          <button
            className="btn btn-quiet btn-small"
            onClick={onOpenUrgent}
            title="Book immediate assistance"
          >
            ⚡ Need Help Now?
          </button>
        )}

        {user ? (
          <>
            <button
              className="user-chip"
              onClick={() => onNavigate('dashboard')}
              title={`Logged in as ${user.name} (${user.role})`}
            >
              <span className="avatar tiny">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
              <span>{user.name ? user.name.split(' ')[0] : 'Account'}</span>
            </button>

            <button
              className="btn btn-outline btn-small"
              onClick={() => onNavigate('bookings')}
            >
              Bookings
            </button>

            <button
              className="btn btn-outline btn-small"
              onClick={onLogout}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-outline btn-small"
              onClick={() => onNavigate('auth', { mode: 'login' })}
            >
              Log in
            </button>
            <button
              className="btn btn-primary btn-small"
              onClick={() => onNavigate('auth', { mode: 'register' })}
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      <button className="mobile-menu" onClick={() => onNavigate('services')}>
        ☰
      </button>
    </header>
  );
}
