import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import {
  getPendingDoctors,
  getDoctorDetails,
  verifyDoctor,
  rejectDoctor,
  getAllDoctors,
  getDoctorStats
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

export default router; 