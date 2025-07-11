const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleCheck } = require('../middleware/role.middleware');
const {
  searchDoctors,
  getDoctorAvailability,
  getNextAvailable,
  initiateBooking,
  confirmBooking,
  rescheduleAppointment
} = require('../controllers/booking.controller');

// All routes require patient authentication
router.use(authMiddleware);
router.use(roleCheck(['patient']));

// Search doctors with filters
router.get('/doctors/search', searchDoctors);

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

module.exports = router; 