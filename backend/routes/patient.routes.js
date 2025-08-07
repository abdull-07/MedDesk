import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import {
  getPatientProfile,
  getPatientsByDoctor
} from '../controllers/patient.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get patient profile by ID (doctors only)
router.get('/:patientId', roleCheck(['doctor']), getPatientProfile);

// Get all patients for a doctor (doctors only)
router.get('/', roleCheck(['doctor']), getPatientsByDoctor);

export default router;