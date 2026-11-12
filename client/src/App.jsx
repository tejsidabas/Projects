import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import UrgentBookingModal from './components/UrgentBookingModal.jsx';
import SmartMatchModal from './components/SmartMatchModal.jsx';
import ReviewModal from './components/ReviewModal.jsx';

import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import HelpersPage from './pages/HelpersPage.jsx';
import HelperProfilePage from './pages/HelperProfilePage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';

import { api } from './services/api.js';

const initialServices = [
  { id: 'cleaning', name: 'House Cleaning', icon: '🧹', price: 200, description: 'Dusting, sweeping, mopping, and home tidying.', color: 'pink' },
  { id: 'cooking', name: 'Cooking', icon: '🍲', price: 250, description: 'Nutritious daily meals prepared at your home.', color: 'orange' },
  { id: 'laundry', name: 'Laundry', icon: '🧺', price: 150, description: 'Washing, folding, and fabric ironing.', color: 'blue' },
  { id: 'dishes', name: 'Dishwashing', icon: '🍽️', price: 150, description: 'Utensils and kitchen sink sanitization.', color: 'green' },
  { id: 'grocery', name: 'Grocery Assistance', icon: '🛍️', price: 150, description: 'Market shopping and daily household errands.', color: 'orange' },
  { id: 'elderly', name: 'Elderly Assistance', icon: '💗', price: 250, description: 'Compassionate companionship and daily routine care.', color: 'teal' }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [services, setServices] = useState(initialServices);
  const [helpers, setHelpers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedService, setSelectedService] = useState(initialServices[0]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [notice, setNotice] = useState('');

  // Modals state
  const [isUrgentOpen, setIsUrgentOpen] = useState(false);
  const [isSmartMatchOpen, setIsSmartMatchOpen] = useState(false);
  const [smartMatchList, setSmartMatchList] = useState([]);
  const [reviewBookingTarget, setReviewBookingTarget] = useState(null);

  // Authentication state
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sahayata_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  function showNotice(msg) {
    setNotice(msg);
  }

  function navigate(page, params = {}) {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function loadData() {
    try {
      const svc = await api.getServices();
      if (Array.isArray(svc) && svc.length > 0) setServices(svc);
    } catch {}

    try {
      const hlp = await api.getHelpers();
      if (Array.isArray(hlp)) setHelpers(hlp);
    } catch {}

    if (localStorage.getItem('sahayata_token')) {
      try {
        const bkg = await api.getBookings();
        if (Array.isArray(bkg)) setBookings(bkg);
      } catch (err) {
        if (err.message.includes('expired') || err.message.includes('token')) {
          handleLogout();
        }
      }
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [notice]);

  async function handleLogin(email, password) {
    const data = await api.login({ email, password });
    localStorage.setItem('sahayata_token', data.token);
    localStorage.setItem('sahayata_user', JSON.stringify(data.user));
    setUser(data.user);
    showNotice(`Welcome back, ${data.user.name}!`);
    navigate('dashboard');
  }

  async function handleRegister(payload) {
    const data = await api.register(payload);
    localStorage.setItem('sahayata_token', data.token);
    localStorage.setItem('sahayata_user', JSON.stringify(data.user));
    setUser(data.user);
    showNotice(`Account created successfully! Welcome, ${data.user.name}.`);
    navigate('dashboard');
  }

  function handleLogout() {
    localStorage.removeItem('sahayata_token');
    localStorage.removeItem('sahayata_user');
    setUser(null);
    setBookings([]);
    showNotice('You have been logged out.');
    navigate('home');
  }

  async function handleCreateBooking(bookingPayload) {
    const data = await api.createBooking(bookingPayload);
    setBookings((prev) => [data.booking, ...prev]);
    showNotice(data.message || 'Booking confirmed!');
    navigate('bookings');
  }

  async function handleUrgentBooking(urgentPayload) {
    const data = await api.urgentBooking(urgentPayload);
    setBookings((prev) => [data.booking, ...prev]);
    showNotice(data.message || 'Urgent helper allocated!');
    navigate('bookings');
  }

  async function handleAttendance(bookingId, action) {
    try {
      const data = await api.recordAttendance(bookingId, action);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? data.booking : b)));
      showNotice(data.message);
    } catch (err) {
      showNotice(err.message);
    }
  }

  async function handleCancelBooking(bookingId) {
    try {
      const updated = await api.updateBooking(bookingId, { status: 'Cancelled' });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
      showNotice('Booking cancelled.');
    } catch (err) {
      showNotice(err.message);
    }
  }

  async function handlePayBooking(bookingId) {
    try {
      const updated = await api.updateBooking(bookingId, { paymentStatus: 'Paid' });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
      showNotice('Payment confirmed (Recorded for demo).');
    } catch (err) {
      showNotice(err.message);
    }
  }

  async function handleReplaceBooking(bookingId) {
    try {
      const data = await api.replaceHelper(bookingId, 'Requested replacement');
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? data.booking : b)));
      showNotice(data.message);
    } catch (err) {
      showNotice(err.message);
    }
  }

  async function handleSubmitReview(bookingId, reviewPayload) {
    try {
      const data = await api.submitReview(bookingId, reviewPayload);
      showNotice(data.message);
      loadData();
    } catch (err) {
      showNotice(err.message);
    }
  }

  async function handleToggleAvailability(newStatus) {
    try {
      const data = await api.setHelperAvailability(newStatus);
      const updatedUser = { ...user, available: data.available };
      setUser(updatedUser);
      localStorage.setItem('sahayata_user', JSON.stringify(updatedUser));
      showNotice(data.message);
      loadData();
    } catch (err) {
      showNotice(err.message);
    }
  }

  async function handleOpenSmartMatch(query) {
    try {
      const data = await api.smartMatch(query);
      setSmartMatchList(data.helpers || []);
      setIsSmartMatchOpen(true);
    } catch (err) {
      showNotice(err.message);
    }
  }

  return (
    <div className="app-shell">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigate}
        user={user}
        onLogout={handleLogout}
        onOpenUrgent={() => setIsUrgentOpen(true)}
      />

      <Toast message={notice} onClose={() => setNotice('')} />

      <main>
        {currentPage === 'home' && (
          <HomePage
            services={services}
            helpers={helpers}
            onNavigate={navigate}
            onSelectService={(s) => setSelectedService(s)}
            onSelectHelper={(h) => setSelectedHelper(h)}
            onOpenUrgent={() => setIsUrgentOpen(true)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            services={services}
            onSelectService={(s) => setSelectedService(s)}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'helpers' && (
          <HelpersPage
            helpers={helpers}
            services={services}
            selectedServiceFilter={pageParams.service || ''}
            onSelectHelper={(h) => setSelectedHelper(h)}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'profile' && (
          <HelperProfilePage
            helper={selectedHelper || helpers[0]}
            services={services}
            onBook={(h) => {
              setSelectedHelper(h);
              navigate('booking');
            }}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'booking' && (
          <BookingPage
            helper={selectedHelper || helpers[0]}
            services={services}
            user={user}
            onCreateBooking={handleCreateBooking}
            onOpenSmartMatch={handleOpenSmartMatch}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'bookings' && (
          <BookingsPage
            bookings={bookings}
            user={user}
            onCancel={handleCancelBooking}
            onPay={handlePayBooking}
            onAttendance={handleAttendance}
            onReplace={handleReplaceBooking}
            onOpenReview={(b) => setReviewBookingTarget(b)}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            user={user}
            bookings={bookings}
            onNavigate={navigate}
            onCancelBooking={handleCancelBooking}
            onPayBooking={handlePayBooking}
            onAttendanceBooking={handleAttendance}
            onReplaceBooking={handleReplaceBooking}
            onOpenReview={(b) => setReviewBookingTarget(b)}
            onOpenUrgent={() => setIsUrgentOpen(true)}
            onToggleAvailability={handleToggleAvailability}
            onShowNotice={showNotice}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage
            initialMode={pageParams.mode || 'login'}
            services={services}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        )}

        {currentPage === 'about' && <AboutPage />}

        {currentPage === 'contact' && (
          <ContactPage onShowNotice={showNotice} />
        )}
      </main>

      <Footer onNavigate={navigate} />

      {/* Modals */}
      <UrgentBookingModal
        isOpen={isUrgentOpen}
        onClose={() => setIsUrgentOpen(false)}
        services={services}
        onConfirmUrgent={handleUrgentBooking}
        userAddress={user?.address}
      />

      <SmartMatchModal
        isOpen={isSmartMatchOpen}
        onClose={() => setIsSmartMatchOpen(false)}
        candidates={smartMatchList}
        serviceName={selectedService?.name || 'Selected Service'}
        onSelectHelper={(h) => {
          setSelectedHelper(h);
          navigate('booking');
        }}
      />

      <ReviewModal
        isOpen={Boolean(reviewBookingTarget)}
        onClose={() => setReviewBookingTarget(null)}
        booking={reviewBookingTarget}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
}
