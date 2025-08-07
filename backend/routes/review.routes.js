import express from 'express';
import { authenticateToken, adminOnly } from '../middleware/auth.middleware.js';
import {
  createReview,
  getDoctorReviews,
  getPatientReviews,
  getPendingReviews,
  moderateReview,
  updateReview,
  deleteReview,
  getDoctorMyReviews,
  addDoctorResponse
} from '../controllers/review.controller.js';

const router = express.Router();

// Protected routes
router.use(authenticateToken);

// Doctor routes (must come before the dynamic :doctorId route)
router.get('/doctor/my-reviews', getDoctorMyReviews);
router.post('/:reviewId/response', addDoctorResponse);

// Patient routes
router.post('/', createReview);
router.get('/my-reviews', getPatientReviews);
router.patch('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

// Public routes (dynamic routes should come last)
router.get('/doctor/:doctorId', getDoctorReviews);

// Admin routes
router.use(adminOnly);
router.get('/pending', getPendingReviews);
router.patch('/:reviewId/moderate', moderateReview);

export default router; 