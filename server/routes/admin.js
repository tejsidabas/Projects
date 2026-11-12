import express from 'express';
import { readData, writeData } from '../utils/storage.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('Admin'));

router.get('/summary', (req, res) => {
  const users = readData('users');
  const bookings = readData('bookings');
  const reviews = readData('reviews');

  const households = users.filter((u) => u.role === 'Household');
  const helpers = users.filter((u) => u.role === 'Helper');
  const verifiedHelpers = helpers.filter((h) => h.verified === true);

  // Aggregates confirmed payments across all completed bookings
  const revenue = bookings
    .filter((b) => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return res.json({
    metrics: {
      totalUsers: users.length,
      householdsCount: households.length,
      helpersCount: helpers.length,
      verifiedHelpersCount: verifiedHelpers.length,
      totalBookings: bookings.length,
      activeBookings: bookings.filter((b) => ['Confirmed', 'In Progress'].includes(b.status)).length,
      completedBookings: bookings.filter((b) => b.status === 'Completed').length,
      cancelledBookings: bookings.filter((b) => b.status === 'Cancelled').length,
      totalRevenue: revenue,
      averageRating: avgRating
    },
    recentBookings: bookings.slice(-8).reverse(),
    recentReviews: reviews.slice(-5).reverse()
  });
});

router.get('/users', (req, res) => {
  const users = readData('users');
  const safeUsers = users.map(({ passwordHash, ...user }) => user);
  return res.json(safeUsers);
});

router.patch('/helpers/:id/verify', (req, res) => {
  const users = readData('users');
  const index = users.findIndex((u) => u.id === req.params.id && u.role === 'Helper');

  if (index === -1) {
    return res.status(404).json({ message: 'Helper profile not found.' });
  }

  const { verified } = req.body;
  users[index].verified = Boolean(verified);
  users[index].updatedAt = new Date().toISOString();
  writeData('users', users);

  return res.json({
    helper: users[index],
    message: `Helper verification set to ${users[index].verified ? 'Verified' : 'Unverified'}.`
  });
});

export default router;
