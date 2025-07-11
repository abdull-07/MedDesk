const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  searchDoctors,
  getSpecializations,
  getLanguages,
  getCities
} = require('../controllers/doctor.controller');

// Public routes
router.get('/search', searchDoctors);
router.get('/specializations', getSpecializations);
router.get('/languages', getLanguages);
router.get('/cities', getCities);

module.exports = router; 