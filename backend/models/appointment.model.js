import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency'],
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  fee: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Validate that endTime is after startTime
appointmentSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    next(new Error('End time must be after start time'));
  }
  next();
});

// Validate that appointment time is in the future
appointmentSchema.pre('save', function(next) {
  if (this.isNew && this.startTime <= new Date()) {
    next(new Error('Appointment time must be in the future'));
  }
  next();
});

// Static method to check for time slot conflicts
appointmentSchema.statics.checkForConflicts = async function(doctorId, startTime, endTime, excludeAppointmentId = null) {
  const query = {
    doctor: doctorId,
    status: { $in: ['scheduled'] }, // Only check scheduled appointments for conflicts
    $or: [
      // New appointment starts during an existing appointment
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      },
      // New appointment contains an existing appointment
      {
        startTime: { $gte: startTime },
        endTime: { $lte: endTime }
      }
    ]
  };

  // Exclude current appointment when checking conflicts for updates
  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }

  const conflictingAppointment = await this.findOne(query);
  return conflictingAppointment;
};

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment; 