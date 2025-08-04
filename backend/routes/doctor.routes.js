import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  searchDoctors,
  getSpecializations,
  getLanguages,
  getCities,
  getDoctorById
} from '../controllers/doctor.controller.js';

const router = express.Router();

// Public routes
router.get('/search', searchDoctors);
router.get('/specializations', getSpecializations);
router.get('/languages', getLanguages);
router.get('/cities', getCities);
// Keep the :id route last to avoid conflicts with other routes
router.get('/:id', getDoctorById);

export default router; 