import express from 'express';
import { readData } from '../utils/storage.js';

const router = express.Router();

router.get('/', (req, res) => {
  const services = readData('services');
  return res.json(services);
});

router.get('/:id', (req, res) => {
  const services = readData('services');
  const service = services.find((s) => s.id === req.params.id);

  if (!service) {
    return res.status(404).json({ message: 'Service not found.' });
  }

  return res.json(service);
});

export default router;
