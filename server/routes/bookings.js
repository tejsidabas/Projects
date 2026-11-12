import express from 'express';
import { readData, writeData, generateId } from '../utils/storage.js';
import { authenticate } from '../middleware/auth.js';
import { hasBookingConflict, rankHelpersForBooking } from '../utils/matching.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const bookings = readData('bookings');
  let result = [];

  if (req.user.role === 'Admin') {
    result = bookings;
  } else if (req.user.role === 'Helper') {
    result = bookings.filter((b) => b.helperId === req.user.id);
  } else {
    result = bookings.filter((b) => b.userId === req.user.id);
  }

  // Orders bookings from most recently created to oldest
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.json(result);
});

router.post('/smart-match', authenticate, (req, res) => {
  const { serviceName, date, time, duration = 2, address } = req.body;

  if (!serviceName || !date || !time) {
    return res.status(400).json({ message: 'Service, date, and time slot are required for matching.' });
  }

  const users = readData('users');
  const helpers = users.filter((u) => u.role === 'Helper');
  const existingBookings = readData('bookings');

  // Ranks helpers according to availability, skill, location, rating, and workload
  const ranked = rankHelpersForBooking({
    helpers,
    serviceName,
    date,
    time,
    duration: Number(duration),
    address: address || '',
    existingBookings
  });

  return res.json({
    totalEligible: ranked.length,
    helpers: ranked
  });
});

router.post('/', authenticate, (req, res) => {
  if (req.user.role !== 'Household') {
    return res.status(403).json({ message: 'Only household accounts can create service bookings.' });
  }

  const {
    serviceId,
    helperId,
    date,
    time,
    duration = 2,
    address,
    notes = '',
    paymentMethod = 'UPI'
  } = req.body;

  const services = readData('services');
  const service = services.find((s) => s.id === serviceId);
  if (!service) {
    return res.status(400).json({ message: 'Please select a valid service.' });
  }

  const users = readData('users');
  const helper = users.find((u) => u.role === 'Helper' && u.id === helperId);
  if (!helper) {
    return res.status(400).json({ message: 'Selected helper could not be found.' });
  }

  if (helper.available === false) {
    return res.status(409).json({ message: 'This helper is currently marked unavailable.' });
  }

  const existingBookings = readData('bookings');

  // Prevents overlapping assignments for the same worker
  const conflict = hasBookingConflict(
    helperId,
    date,
    time,
    Number(duration),
    existingBookings
  );

  if (conflict) {
    return res.status(409).json({
      message: 'This helper already has a booking at the requested slot. Please choose another slot or helper.'
    });
  }

  const totalAmount = Number(service.price) * (Number(duration) || 2);

  const newBooking = {
    id: `b_${generateId()}`,
    userId: req.user.id,
    userName: req.user.name,
    helperId: helper.id,
    helperName: helper.name,
    helperPhone: helper.phone,
    serviceId: service.id,
    serviceName: service.name,
    icon: service.icon,
    date,
    time,
    duration: Number(duration) || 2,
    address: address.trim(),
    notes: notes.trim(),
    amount: totalAmount,
    status: 'Confirmed',
    paymentStatus: 'Pending',
    paymentMethod,
    checkInTime: null,
    checkOutTime: null,
    attendanceRecorded: false,
    replacementHistory: [],
    createdAt: new Date().toISOString()
  };

  existingBookings.push(newBooking);
  writeData('bookings', existingBookings);

  return res.status(201).json({
    booking: newBooking,
    message: 'Booking confirmed successfully.'
  });
});

router.post('/urgent', authenticate, (req, res) => {
  if (req.user.role !== 'Household') {
    return res.status(403).json({ message: 'Only household accounts can request urgent bookings.' });
  }

  const { serviceId, address, notes = '', duration = 2 } = req.body;

  const services = readData('services');
  const service = services.find((s) => s.id === serviceId) || services[0];

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const hour = String(now.getHours() + 1).padStart(2, '0');
  const timeStr = `${hour}:00`;

  const users = readData('users');
  const helpers = users.filter((u) => u.role === 'Helper');
  const existingBookings = readData('bookings');

  // Identifies highest scoring worker available for the immediate upcoming slot
  const ranked = rankHelpersForBooking({
    helpers,
    serviceName: service.name,
    date: dateStr,
    time: timeStr,
    duration: Number(duration),
    address: address || req.user.address || '',
    existingBookings
  });

  if (ranked.length === 0) {
    return res.status(404).json({
      message: 'No available helper found for immediate dispatch in your area. Please select a later slot.'
    });
  }

  const bestHelper = ranked[0];
  const totalAmount = Number(service.price) * Number(duration);

  const urgentBooking = {
    id: `b_${generateId()}`,
    userId: req.user.id,
    userName: req.user.name,
    helperId: bestHelper.id,
    helperName: bestHelper.name,
    helperPhone: bestHelper.phone,
    serviceId: service.id,
    serviceName: service.name,
    icon: service.icon,
    date: dateStr,
    time: timeStr,
    duration: Number(duration),
    address: (address || req.user.address || 'Address provided on profile').trim(),
    notes: `[URGENT REQUEST] ${notes}`.trim(),
    amount: totalAmount,
    status: 'Confirmed',
    paymentStatus: 'Pending',
    paymentMethod: 'UPI',
    checkInTime: null,
    checkOutTime: null,
    attendanceRecorded: false,
    matchScore: bestHelper.matchScore,
    replacementHistory: [],
    createdAt: new Date().toISOString()
  };

  existingBookings.push(urgentBooking);
  writeData('bookings', existingBookings);

  return res.status(201).json({
    booking: urgentBooking,
    helper: bestHelper,
    message: `Urgent help assigned to ${bestHelper.name} (Match Score: ${bestHelper.matchScore}%).`
  });
});

router.post('/:id/replace', authenticate, (req, res) => {
  const bookings = readData('bookings');
  const booking = bookings.find((b) => b.id === req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  const isOwner = booking.userId === req.user.id;
  const isAssigned = booking.helperId === req.user.id;
  const isAdmin = req.user.role === 'Admin';

  if (!isOwner && !isAssigned && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to request replacement for this booking.' });
  }

  const users = readData('users');
  const helpers = users.filter((u) => u.role === 'Helper');

  // Excludes previous helper and any previously rejected helpers for this booking
  const excludeIds = [booking.helperId, ...(booking.replacementHistory || []).map((h) => h.previousHelperId)];

  const replacementCandidates = rankHelpersForBooking({
    helpers,
    serviceName: booking.serviceName,
    date: booking.date,
    time: booking.time,
    duration: booking.duration,
    address: booking.address,
    existingBookings: bookings,
    excludeHelperIds: excludeIds
  });

  if (replacementCandidates.length === 0) {
    return res.status(404).json({
      message: 'No alternative helpers are currently available for this slot. Please choose a different date or time.'
    });
  }

  const newHelper = replacementCandidates[0];
  const oldHelperName = booking.helperName;

  booking.replacementHistory = booking.replacementHistory || [];
  booking.replacementHistory.push({
    previousHelperId: booking.helperId,
    previousHelperName: booking.helperName,
    replacedAt: new Date().toISOString(),
    reason: req.body.reason || 'Helper unavailable / Reassigned'
  });

  booking.helperId = newHelper.id;
  booking.helperName = newHelper.name;
  booking.helperPhone = newHelper.phone;
  booking.status = 'Confirmed';
  booking.matchScore = newHelper.matchScore;
  booking.updatedAt = new Date().toISOString();

  writeData('bookings', bookings);

  return res.json({
    booking,
    message: `Replacement allocated: ${oldHelperName} was replaced by ${newHelper.name} (${newHelper.matchScore}% suitability).`
  });
});

router.patch('/:id/attendance', authenticate, (req, res) => {
  const bookings = readData('bookings');
  const booking = bookings.find((b) => b.id === req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  const isAssigned = booking.helperId === req.user.id;
  const isOwner = booking.userId === req.user.id;
  const isAdmin = req.user.role === 'Admin';

  if (!isAssigned && !isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to record attendance for this booking.' });
  }

  const { action } = req.body;

  if (action === 'check-in') {
    booking.checkInTime = new Date().toISOString();
    booking.status = 'In Progress';
    writeData('bookings', bookings);
    return res.json({ booking, message: 'Check-in recorded. Service is now in progress.' });
  }

  if (action === 'check-out') {
    booking.checkOutTime = new Date().toISOString();
    booking.status = 'Completed';
    booking.attendanceRecorded = true;

    // Computes elapsed working duration in minutes
    if (booking.checkInTime) {
      const startMs = new Date(booking.checkInTime).getTime();
      const endMs = new Date(booking.checkOutTime).getTime();
      booking.actualDurationMinutes = Math.round((endMs - startMs) / (1000 * 60));
    }

    writeData('bookings', bookings);
    return res.json({ booking, message: 'Check-out completed. Booking marked as Completed.' });
  }

  return res.status(400).json({ message: 'Invalid attendance action. Use check-in or check-out.' });
});

router.patch('/:id', authenticate, (req, res) => {
  const bookings = readData('bookings');
  const booking = bookings.find((b) => b.id === req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  const isOwner = booking.userId === req.user.id;
  const isAssigned = booking.helperId === req.user.id;
  const isAdmin = req.user.role === 'Admin';

  if (!isOwner && !isAssigned && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to update this booking.' });
  }

  const { status, paymentStatus, paymentMethod } = req.body;

  if (status && ['Confirmed', 'In Progress', 'Completed', 'Cancelled'].includes(status)) {
    booking.status = status;
  }

  if (paymentStatus && ['Pending', 'Paid'].includes(paymentStatus)) {
    booking.paymentStatus = paymentStatus;
    if (paymentStatus === 'Paid') {
      booking.paidAt = new Date().toISOString();
    }
  }

  if (paymentMethod) {
    booking.paymentMethod = paymentMethod;
  }

  booking.updatedAt = new Date().toISOString();
  writeData('bookings', bookings);

  return res.json(booking);
});

router.post('/:id/review', authenticate, (req, res) => {
  if (req.user.role !== 'Household') {
    return res.status(403).json({ message: 'Only households can submit service reviews.' });
  }

  const bookings = readData('bookings');
  const booking = bookings.find((b) => b.id === req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  if (booking.userId !== req.user.id) {
    return res.status(403).json({ message: 'You can only review your own bookings.' });
  }

  if (booking.status !== 'Completed') {
    return res.status(400).json({ message: 'Reviews can only be submitted after service completion.' });
  }

  const { rating, comment = '' } = req.body;
  const numericRating = Math.max(1, Math.min(5, Number(rating) || 5));

  const reviewRecord = {
    id: `rev_${generateId()}`,
    bookingId: booking.id,
    helperId: booking.helperId,
    helperName: booking.helperName,
    userId: req.user.id,
    userName: req.user.name,
    rating: numericRating,
    comment: comment.trim(),
    createdAt: new Date().toISOString()
  };

  const reviews = readData('reviews');
  reviews.push(reviewRecord);
  writeData('reviews', reviews);

  booking.review = {
    rating: numericRating,
    comment: comment.trim(),
    createdAt: reviewRecord.createdAt
  };
  writeData('bookings', bookings);

  // Recalculates worker's cumulative average rating
  const users = readData('users');
  const helper = users.find((u) => u.id === booking.helperId);
  if (helper) {
    const helperReviews = reviews.filter((r) => r.helperId === helper.id);
    const sumRatings = helperReviews.reduce((sum, r) => sum + r.rating, 0);
    helper.reviews = helperReviews.length;
    helper.rating = Number((sumRatings / helperReviews.length).toFixed(1));
    writeData('users', users);
  }

  return res.status(201).json({
    review: reviewRecord,
    message: 'Thank you! Your rating and review have been recorded.'
  });
});

export default router;
