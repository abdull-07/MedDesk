import express from 'express';
import { 
  adminLogin, 
  registerDoctor, 
  registerPatient, 
  login, 
  getProfile,
  updateProfile 
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin routes
router.post('/admin/login', adminLogin);

// Doctor routes
router.post('/doctor/register', registerDoctor);

// Patient routes
router.post('/patient/register', registerPatient);

// Common routes
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router; 