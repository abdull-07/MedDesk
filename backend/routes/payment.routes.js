const express = require('express');
const router = express.Router();
const { createJazzCashPayment, handlePaymentCallback } = require('../controllers/payment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// JazzCash payment routes
router.post('/jazzcash/create', authenticateToken, createJazzCashPayment);
router.post('/jazzcash/callback', handlePaymentCallback);

module.exports = router; 