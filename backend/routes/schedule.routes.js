import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { roleCheck } from '../middleware/role.middleware.js';
import {
  getSchedule,
  updateSchedule,
  addBreakTime,
  removeBreakTime,
  addDateOverride,
  removeDateOverride,
  getAvailability
} from '../controllers/schedule.controller.js';

const router = express.Router();

// All routes require doctor authentication
router.use(authenticateToken);
router.use(roleCheck(['doctor']));

// Get doctor's schedule
router.get('/schedule', getSchedule);

// Update recurring schedule
router.put('/schedule', updateSchedule);

// Break time management
router.post('/schedule/breaks', addBreakTime);
router.delete('/schedule/breaks/:id', removeBreakTime);

// Date override management (holidays, time off)
router.post('/schedule/overrides', addDateOverride);
router.delete('/schedule/overrides/:id', removeDateOverride);

// Get availability for a date range
router.get('/availability', getAvailability);

export default router; 