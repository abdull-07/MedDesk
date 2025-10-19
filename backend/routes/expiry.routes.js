import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import ExpiryService from '../services/expiry.service.js';

const router = express.Router();

// Manual trigger for expiry check (admin only)
router.post(
  '/check',
  authenticateToken,
  roleCheck(['admin']),
  async (req, res) => {
    try {
      const result = await ExpiryService.manualExpiryCheck();
      
      res.json({
        message: 'Expiry check completed successfully',
        processed: result.processed,
        appointments: result.appointments
      });

    } catch (error) {
      console.error('Manual expiry check error:', error);
      res.status(500).json({
        message: 'Error processing expired appointments',
        error: error.message
      });
    }
  }
);

// Get appointments that will expire soon (admin and doctors)
router.get(
  '/expiring',
  authenticateToken,
  roleCheck(['admin', 'doctor']),
  async (req, res) => {
    try {
      const { minutes = 60 } = req.query;
      const minutesAhead = parseInt(minutes);

      if (isNaN(minutesAhead) || minutesAhead < 0) {
        return res.status(400).json({
          message: 'Invalid minutes parameter'
        });
      }

      const expiringAppointments = await ExpiryService.getExpiringAppointments(minutesAhead);

      res.json({
        message: `Found ${expiringAppointments.length} appointments expiring in the next ${minutesAhead} minutes`,
        appointments: expiringAppointments,
        minutesAhead
      });

    } catch (error) {
      console.error('Get expiring appointments error:', error);
      res.status(500).json({
        message: 'Error fetching expiring appointments',
        error: error.message
      });
    }
  }
);

export default router;