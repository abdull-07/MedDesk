import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import {
  getPendingDoctors,
  getDoctorDetails,
  verifyDoctor,
  rejectDoctor,
  getAllDoctors,
  getDoctorStats,
  getDashboardStats,
  getRecentActivities,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getAllAppointments,
  updateAppointmentStatus,
  getReports,
  getAuditLogs
} from '../controllers/admin.controller.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(roleCheck(['admin']));

// Get all pending doctor verifications
router.get('/doctors/pending', getPendingDoctors);

// Get all doctors (with filters)
router.get('/doctors', getAllDoctors);

// Get doctor verification details
router.get('/doctors/:id', getDoctorDetails);

// Get doctor statistics
router.get('/doctors/stats', getDoctorStats);

// Approve doctor verification
router.post('/doctors/:id/verify', verifyDoctor);

// Reject doctor verification
router.post('/doctors/:id/reject', rejectDoctor);

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/recent-activities', getRecentActivities);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);

// Appointment management routes
router.get('/appointments', getAllAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

// Reports routes
router.get('/reports/appointments', getReports);
router.get('/reports/revenue', getReports);
router.get('/reports/specialties', getReports);
router.get('/reports/user-growth', getReports);

// Audit logs routes
router.get('/logs', getAuditLogs);

export default router; 