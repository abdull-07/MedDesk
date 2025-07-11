const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { roleCheck } = require('../middleware/role.middleware');
const {
  getSchedule,
  updateSchedule,
  addBreakTime,
  removeBreakTime,
  addDateOverride,
  removeDateOverride,
  getAvailability
} = require('../controllers/schedule.controller');

// All routes require doctor authentication
router.use(authMiddleware);
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

module.exports = router; 