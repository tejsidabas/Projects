import express from 'express';
import { readData, writeData } from '../utils/storage.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

function sanitizeHelper(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

router.get('/', (req, res) => {
  const users = readData('users');
  let helpers = users.filter((u) => u.role === 'Helper');

  if (req.query.service && req.query.service !== 'All Services') {
    const serviceName = req.query.service.toLowerCase();
    helpers = helpers.filter((h) =>
      Array.isArray(h.skills) && h.skills.some((s) => s.toLowerCase() === serviceName)
    );
  }

  if (req.query.area) {
    const areaQuery = req.query.area.toLowerCase();
    helpers = helpers.filter((h) => (h.area || '').toLowerCase().includes(areaQuery));
  }

  if (req.query.availableOnly === 'true') {
    helpers = helpers.filter((h) => h.available !== false);
  }

  if (req.query.search) {
    const q = req.query.search.toLowerCase().trim();
    helpers = helpers.filter((h) => {
      const skillsStr = (h.skills || []).join(' ').toLowerCase();
      const name = (h.name || '').toLowerCase();
      const area = (h.area || '').toLowerCase();
      return name.includes(q) || area.includes(q) || skillsStr.includes(q);
    });
  }

  return res.json(helpers.map(sanitizeHelper));
});

router.get('/:id', (req, res) => {
  const users = readData('users');
  const helper = users.find((u) => u.role === 'Helper' && u.id === req.params.id);

  if (!helper) {
    return res.status(404).json({ message: 'Helper profile not found.' });
  }

  const reviews = readData('reviews').filter((r) => r.helperId === req.params.id);

  return res.json({
    ...sanitizeHelper(helper),
    reviewsList: reviews
  });
});

router.patch('/me/availability', authenticate, (req, res) => {
  if (req.user.role !== 'Helper') {
    return res.status(403).json({ message: 'Only helper accounts can update availability status.' });
  }

  const users = readData('users');
  const index = users.findIndex((u) => u.id === req.user.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Helper profile not found.' });
  }

  users[index].available = Boolean(req.body.available);
  users[index].updatedAt = new Date().toISOString();
  writeData('users', users);

  return res.json({
    available: users[index].available,
    message: `Availability set to ${users[index].available ? 'Available' : 'Unavailable'}.`
  });
});

export default router;
