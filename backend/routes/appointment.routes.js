import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getDoctorSchedule
} from '../controllers/appointment.controller.js';

const router = express.Router();

// Create appointment (patients only)
router.post(
  '/',
  authenticateToken,
  roleCheck(['patient']),
  createAppointment
);

// Get all appointments (filtered by role)
router.get(
  '/',
  authenticateToken,
  getAppointments
);

// Get specific appointment
router.get(
  '/:id',
  authenticateToken,
  getAppointmentById
);

// Update appointment (doctors only)
router.put(
  '/:id',
  authenticateToken,
  roleCheck(['doctor']),
  updateAppointment
);

// Cancel appointment (both patient and doctor)
router.post(
  '/:id/cancel',
  authenticateToken,
  roleCheck(['patient', 'doctor']),
  cancelAppointment
);

// Reschedule appointment (both patient and doctor)
router.post(
  '/:id/reschedule',
  authenticateToken,
  roleCheck(['patient', 'doctor']),
  rescheduleAppointment
);

// Get doctor's schedule (available and booked slots)
router.get(
  '/doctors/:id/schedule',
  authenticateToken,
  getDoctorSchedule
);

export default router; 