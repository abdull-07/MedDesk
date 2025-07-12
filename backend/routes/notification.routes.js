import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../controllers/notification.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's notifications
router.get('/', getUserNotifications);

// Mark notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read
router.patch('/read-all', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

export default router; 