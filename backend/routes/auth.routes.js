const express = require('express');
const router = express.Router();
const { 
  adminLogin, 
  registerDoctor,
  login, 
  getProfile 
} = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Admin routes
router.post('/admin/login', adminLogin);

// Doctor routes
router.post('/auth/doctor/register', registerDoctor);
router.post('/auth/doctor/login', login);
router.get('/auth/doctor/me', authMiddleware, getProfile);

// Patient routes
router.post('/auth/patient/register', (req, res, next) => {
  req.body.role = 'patient';
  next();
}, login);

router.post('/auth/patient/login', login);
router.get('/auth/patient/me', authMiddleware, getProfile);

module.exports = router; 