const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleCheck } = require('../middleware/role.middleware');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getDoctorSchedule
} = require('../controllers/appointment.controller');

// Create appointment (patients only)
router.post(
  '/appointments',
  authMiddleware,
  roleCheck(['patient']),
  createAppointment
);

// Get all appointments (filtered by role)
router.get(
  '/appointments',
  authMiddleware,
  getAppointments
);

// Get specific appointment
router.get(
  '/appointments/:id',
  authMiddleware,
  getAppointmentById
);

// Update appointment (doctors only)
router.put(
  '/appointments/:id',
  authMiddleware,
  roleCheck(['doctor']),
  updateAppointment
);

// Cancel appointment (both patient and doctor)
router.post(
  '/appointments/:id/cancel',
  authMiddleware,
  roleCheck(['patient', 'doctor']),
  cancelAppointment
);

// Get doctor's schedule (available and booked slots)
router.get(
  '/doctors/:id/schedule',
  authMiddleware,
  getDoctorSchedule
);

module.exports = router; 