const Schedule = require('../models/schedule.model');

// Get doctor's schedule
const getSchedule = async (req, res) => {
  try {
    let schedule = await Schedule.findOne({ doctor: req.user.id });

    if (!schedule) {
      // Create default schedule if none exists
      schedule = new Schedule({
        doctor: req.user.id,
        recurringSchedule: [
          // Default working hours (Mon-Fri, 9 AM - 5 PM)
          ...Array.from({ length: 5 }, (_, i) => ({
            dayOfWeek: i + 1,
            startTime: '09:00',
            endTime: '17:00',
            isWorkingDay: true
          })),
          // Weekend (not working)
          { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isWorkingDay: false },
          { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isWorkingDay: false }
        ]
      });
      await schedule.save();
    }

    res.json(schedule);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update recurring schedule
const updateSchedule = async (req, res) => {
  try {
    const {
      recurringSchedule,
      slotDuration,
      bufferTime,
      maxAdvanceBooking,
      timezone
    } = req.body;

    let schedule = await Schedule.findOne({ doctor: req.user.id });

    if (!schedule) {
      schedule = new Schedule({ doctor: req.user.id });
    }

    // Update fields if provided
    if (recurringSchedule) schedule.recurringSchedule = recurringSchedule;
    if (slotDuration) schedule.slotDuration = slotDuration;
    if (bufferTime) schedule.bufferTime = bufferTime;
    if (maxAdvanceBooking) schedule.maxAdvanceBooking = maxAdvanceBooking;
    if (timezone) schedule.timezone = timezone;

    await schedule.save();

    res.json({
      message: 'Schedule updated successfully',
      schedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    if (error.message.includes('validation failed')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Add break time
const addBreakTime = async (req, res) => {
  try {
    const { startTime, endTime, dayOfWeek } = req.body;

    if (!startTime || !endTime || dayOfWeek === undefined) {
      return res.status(400).json({
        message: 'Please provide start time, end time, and day of week'
      });
    }

    let schedule = await Schedule.findOne({ doctor: req.user.id });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Add break time
    schedule.breakTimes.push({ startTime, endTime, dayOfWeek });
    await schedule.save();

    res.json({
      message: 'Break time added successfully',
      schedule
    });
  } catch (error) {
    console.error('Add break time error:', error);
    if (error.message.includes('validation failed')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Remove break time
const removeBreakTime = async (req, res) => {
  try {
    const breakTimeId = req.params.id;
    
    let schedule = await Schedule.findOne({ doctor: req.user.id });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Remove break time
    schedule.breakTimes = schedule.breakTimes.filter(
      break_ => break_._id.toString() !== breakTimeId
    );
    
    await schedule.save();

    res.json({
      message: 'Break time removed successfully',
      schedule
    });
  } catch (error) {
    console.error('Remove break time error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add date override (holiday, time off)
const addDateOverride = async (req, res) => {
  try {
    const { date, isAvailable, startTime, endTime, reason } = req.body;

    if (!date) {
      return res.status(400).json({
        message: 'Please provide a date'
      });
    }

    let schedule = await Schedule.findOne({ doctor: req.user.id });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Add date override
    schedule.dateOverrides.push({
      date: new Date(date),
      isAvailable,
      startTime,
      endTime,
      reason
    });

    await schedule.save();

    res.json({
      message: 'Date override added successfully',
      schedule
    });
  } catch (error) {
    console.error('Add date override error:', error);
    if (error.message.includes('validation failed')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Remove date override
const removeDateOverride = async (req, res) => {
  try {
    const overrideId = req.params.id;
    
    let schedule = await Schedule.findOne({ doctor: req.user.id });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Remove date override
    schedule.dateOverrides = schedule.dateOverrides.filter(
      override => override._id.toString() !== overrideId
    );
    
    await schedule.save();

    res.json({
      message: 'Date override removed successfully',
      schedule
    });
  } catch (error) {
    console.error('Remove date override error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get availability for a date range
const getAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Please provide start and end dates'
      });
    }

    const schedule = await Schedule.findOne({ doctor: req.user.id });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const availability = [];

    // Generate availability for each day in the range
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      
      // Check for date override
      const override = schedule.dateOverrides.find(o => 
        o.date.toDateString() === date.toDateString()
      );

      if (override) {
        if (override.isAvailable) {
          availability.push({
            date: new Date(date),
            startTime: override.startTime,
            endTime: override.endTime,
            type: 'override'
          });
        }
        continue;
      }

      // Get regular schedule for this day
      const regularSchedule = schedule.recurringSchedule.find(
        s => s.dayOfWeek === dayOfWeek && s.isWorkingDay
      );

      if (regularSchedule) {
        // Get breaks for this day
        const dayBreaks = schedule.breakTimes.filter(b => b.dayOfWeek === dayOfWeek);

        availability.push({
          date: new Date(date),
          startTime: regularSchedule.startTime,
          endTime: regularSchedule.endTime,
          breaks: dayBreaks,
          type: 'regular'
        });
      }
    }

    res.json({
      availability,
      schedule: {
        slotDuration: schedule.slotDuration,
        bufferTime: schedule.bufferTime
      }
    });

  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getSchedule,
  updateSchedule,
  addBreakTime,
  removeBreakTime,
  addDateOverride,
  removeDateOverride,
  getAvailability
}; 