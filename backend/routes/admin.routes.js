const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleCheck } = require('../middleware/role.middleware');
const {
  getPendingDoctors,
  getDoctorDetails,
  verifyDoctor,
  rejectDoctor,
  getAllDoctors,
  getDoctorStats
} = require('../controllers/admin.controller');

// All routes require admin authentication
router.use(authMiddleware);
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

module.exports = router; 