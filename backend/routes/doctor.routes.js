import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  searchDoctors,
  getSpecializations,
  getLanguages,
  getCities,
  getDoctorById,
  getDoctorStats,
  getDoctorTodayAppointments
} from '../controllers/doctor.controller.js';
import { getDoctorByUserId } from '../controllers/booking.controller.js';

const router = express.Router();

// Public routes
router.get('/search', searchDoctors);
router.get('/specializations', getSpecializations);
router.get('/languages', getLanguages);
router.get('/cities', getCities);

// Protected routes for doctors
router.get('/dashboard/stats', authenticateToken, getDoctorStats);
router.get('/dashboard/today-appointments', authenticateToken, getDoctorTodayAppointments);

// Get doctor profile by user ID (for schedule management)
router.get('/user/:userId', authenticateToken, getDoctorByUserId);

// Keep the :id route last to avoid conflicts with other routes
router.get('/:id', getDoctorById);

export default router; 