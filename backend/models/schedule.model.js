import mongoose from 'mongoose';

// Schema for recurring schedule rules
const recurringScheduleSchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0, // Sunday
    max: 6  // Saturday
  },
  startTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:mm format
  },
  endTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:mm format
  },
  isWorkingDay: {
    type: Boolean,
    default: true
  }
});

// Schema for break times
const breakTimeSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:mm format
  },
  endTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:mm format
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  }
});

// Schema for specific date overrides (holidays, time off, etc.)
const dateOverrideSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: String,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:mm format
  },
  endTime: {
    type: String,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // HH:mm format
  },
  reason: {
    type: String,
    trim: true
  }
});

// Main schedule schema
const scheduleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  recurringSchedule: [recurringScheduleSchema],
  breakTimes: [breakTimeSchema],
  dateOverrides: [dateOverrideSchema],
  slotDuration: {
    type: Number,
    default: 30, // minutes
    min: 15,
    max: 120
  },
  bufferTime: {
    type: Number,
    default: 0, // minutes between appointments
    min: 0,
    max: 60
  },
  maxAdvanceBooking: {
    type: Number,
    default: 30, // days
    min: 1,
    max: 90
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated timestamp before saving
scheduleSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Validate time ranges
const validateTimeRange = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}Z`);
  const end = new Date(`1970-01-01T${endTime}Z`);
  return end > start;
};

// Validate recurring schedule
scheduleSchema.pre('save', function(next) {
  // Check for overlapping working hours
  const workingHours = this.recurringSchedule.filter(s => s.isWorkingDay);
  for (let i = 0; i < workingHours.length; i++) {
    const current = workingHours[i];
    
    // Validate time range
    if (!validateTimeRange(current.startTime, current.endTime)) {
      return next(new Error(`Invalid time range for day ${current.dayOfWeek}`));
    }

    // Check for overlaps on same day
    for (let j = i + 1; j < workingHours.length; j++) {
      const other = workingHours[j];
      if (current.dayOfWeek === other.dayOfWeek) {
        const currentStart = new Date(`1970-01-01T${current.startTime}Z`);
        const currentEnd = new Date(`1970-01-01T${current.endTime}Z`);
        const otherStart = new Date(`1970-01-01T${other.startTime}Z`);
        const otherEnd = new Date(`1970-01-01T${other.endTime}Z`);

        if (currentStart < otherEnd && currentEnd > otherStart) {
          return next(new Error(`Overlapping working hours on day ${current.dayOfWeek}`));
        }
      }
    }
  }

  // Validate break times
  for (const breakTime of this.breakTimes) {
    if (!validateTimeRange(breakTime.startTime, breakTime.endTime)) {
      return next(new Error('Break time end must be after start'));
    }

    // Check if break is within working hours
    const workingHour = workingHours.find(w => w.dayOfWeek === breakTime.dayOfWeek);
    if (workingHour) {
      const breakStart = new Date(`1970-01-01T${breakTime.startTime}Z`);
      const breakEnd = new Date(`1970-01-01T${breakTime.endTime}Z`);
      const workStart = new Date(`1970-01-01T${workingHour.startTime}Z`);
      const workEnd = new Date(`1970-01-01T${workingHour.endTime}Z`);

      if (breakStart < workStart || breakEnd > workEnd) {
        return next(new Error('Break time must be within working hours'));
      }
    }
  }

  next();
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule; 