import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getDoctorSchedule
} from '../controllers/appointment.controller.js';

const router = express.Router();

// Create appointment (patients only)
router.post(
  '/appointments',
  authenticateToken,
  roleCheck(['patient']),
  createAppointment
);

// Get all appointments (filtered by role)
router.get(
  '/appointments',
  authenticateToken,
  getAppointments
);

// Get specific appointment
router.get(
  '/appointments/:id',
  authenticateToken,
  getAppointmentById
);

// Update appointment (doctors only)
router.put(
  '/appointments/:id',
  authenticateToken,
  roleCheck(['doctor']),
  updateAppointment
);

// Cancel appointment (both patient and doctor)
router.post(
  '/appointments/:id/cancel',
  authenticateToken,
  roleCheck(['patient', 'doctor']),
  cancelAppointment
);

// Get doctor's schedule (available and booked slots)
router.get(
  '/doctors/:id/schedule',
  authenticateToken,
  getDoctorSchedule
);

export default router; 