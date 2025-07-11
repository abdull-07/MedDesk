const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/auth.middleware');
const {
  createReview,
  getDoctorReviews,
  getPatientReviews,
  getPendingReviews,
  moderateReview,
  updateReview,
  deleteReview
} = require('../controllers/review.controller');

// Public routes
router.get('/doctor/:doctorId', getDoctorReviews);

// Protected routes
router.use(authMiddleware);

// Patient routes
router.post('/', createReview);
router.get('/my-reviews', getPatientReviews);
router.patch('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

// Admin routes
router.use(adminOnly);
router.get('/pending', getPendingReviews);
router.patch('/:reviewId/moderate', moderateReview);

module.exports = router; 