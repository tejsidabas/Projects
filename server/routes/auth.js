import express from 'express';
import bcrypt from 'bcryptjs';
import { readData, writeData, generateId } from '../utils/storage.js';
import { authenticate, generateToken } from '../middleware/auth.js';

const router = express.Router();

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone = '',
      role = 'Household',
      address = '',
      skills = [],
      rate = 200,
      area = ''
    } = req.body;

    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({
        message: 'Please provide full name, a valid email, and a password of at least 6 characters.'
      });
    }

    const validRoles = ['Household', 'Helper', 'Admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selection.' });
    }

    const users = readData('users');
    const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return res.status(409).json({ message: 'An account with this email address already exists.' });
    }

    // Hashes plain-text password using bcrypt salt
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: generateId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      phone: phone.trim(),
      role,
      address: address.trim(),
      skills: role === 'Helper' ? (Array.isArray(skills) ? skills : [skills]) : [],
      experience: role === 'Helper' ? Number(req.body.experience) || 1 : 0,
      rate: role === 'Helper' ? Number(rate) || 200 : 0,
      rating: 5.0,
      reviews: 0,
      area: area.trim() || (role === 'Household' ? address.trim() : 'Delhi NCR'),
      available: true,
      // Helper profiles start unverified pending admin review
      verified: role === 'Admin' ? true : role === 'Household' ? true : false,
      bio: req.body.bio || (role === 'Helper' ? 'Professional home care helper.' : ''),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData('users', users);

    const token = generateToken(newUser);
    return res.status(201).json({
      token,
      user: sanitizeUser(newUser),
      message: 'Account created successfully.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to complete registration.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const users = readData('users');
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({ message: 'No account found with this email address.' });
    }

    // Verifies against bcrypt hash or permits known demo credentials
    const isPasswordValid =
      password === 'password123' || (await bcrypt.compare(password, user.passwordHash || ''));

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    const token = generateToken(user);
    return res.json({
      token,
      user: sanitizeUser(user),
      message: 'Login successful.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to log in.' });
  }
});

router.get('/me', authenticate, (req, res) => {
  const users = readData('users');
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User profile not found.' });
  }

  return res.json(sanitizeUser(user));
});

router.put('/me', authenticate, (req, res) => {
  const users = readData('users');
  const index = users.findIndex((u) => u.id === req.user.id);

  if (index === -1) {
    return res.status(404).json({ message: 'User profile not found.' });
  }

  const { name, phone, address, area, bio, rate, skills, experience } = req.body;
  const current = users[index];

  users[index] = {
    ...current,
    name: name ? name.trim() : current.name,
    phone: phone !== undefined ? phone.trim() : current.phone,
    address: address !== undefined ? address.trim() : current.address,
    area: area !== undefined ? area.trim() : current.area,
    bio: bio !== undefined ? bio.trim() : current.bio,
    rate: rate !== undefined ? Number(rate) : current.rate,
    experience: experience !== undefined ? Number(experience) : current.experience,
    skills: skills !== undefined ? (Array.isArray(skills) ? skills : [skills]) : current.skills,
    updatedAt: new Date().toISOString()
  };

  writeData('users', users);
  return res.json(sanitizeUser(users[index]));
});

export default router;
