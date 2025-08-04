import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import {
  searchDoctors,
  getDoctorByUserId,
  getDoctorAvailability,
  getNextAvailable,
  initiateBooking,
  confirmBooking,
  rescheduleAppointment
} from '../controllers/booking.controller.js';

const router = express.Router();

// All routes require patient authentication
router.use(authenticateToken);
router.use(roleCheck(['patient']));

// Search doctors with filters
router.get('/doctors/search', searchDoctors);

// Get doctor profile by user ID
router.get('/doctors/by-user/:userId', getDoctorByUserId);

// Get doctor's availability for a date range
router.get('/doctors/:id/availability', getDoctorAvailability);

// Get next available slot for a doctor
router.get('/doctors/:id/next-available', getNextAvailable);

// Initiate booking (holds the slot temporarily)
router.post('/appointments/initiate', initiateBooking);

// Confirm booking
router.post('/appointments/confirm', confirmBooking);

// Reschedule appointment
router.post('/appointments/:id/reschedule', rescheduleAppointment);

export default router; 