import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import helpersRoutes from './routes/helpers.js';
import bookingsRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  return res.json({
    status: 'ok',
    project: 'Sahayata — Smart Help for Every Home',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/helpers', helpersRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/admin', adminRoutes);

app.use((_req, res) => {
  return res.status(404).json({ message: 'Requested API endpoint was not found.' });
});

app.use((err, _req, res, _next) => {
  console.error('Server Error:', err);
  return res.status(500).json({ message: 'Internal server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`Sahayata API server running at http://localhost:${PORT}`);
});
