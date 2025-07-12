import express from 'express';
import { authenticateToken, adminOnly } from '../middleware/auth.middleware.js';
import {
  createReview,
  getDoctorReviews,
  getPatientReviews,
  getPendingReviews,
  moderateReview,
  updateReview,
  deleteReview
} from '../controllers/review.controller.js';

const router = express.Router();

// Public routes
router.get('/doctor/:doctorId', getDoctorReviews);

// Protected routes
router.use(authenticateToken);

// Patient routes
router.post('/', createReview);
router.get('/my-reviews', getPatientReviews);
router.patch('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

// Admin routes
router.use(adminOnly);
router.get('/pending', getPendingReviews);
router.patch('/:reviewId/moderate', moderateReview);

export default router; 