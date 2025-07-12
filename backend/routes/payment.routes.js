import express from 'express';
import { createJazzCashPayment, handlePaymentCallback } from '../controllers/payment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// JazzCash payment routes
router.post('/jazzcash/create', authenticateToken, createJazzCashPayment);
router.post('/jazzcash/callback', handlePaymentCallback);

export default router; 