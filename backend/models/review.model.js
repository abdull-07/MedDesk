import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true // One review per appointment
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderationReason: {
    type: String,
    trim: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
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

// Update timestamps before saving
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create compound index for patient and doctor
reviewSchema.index({ patient: 1, doctor: 1 });

// Create index for status and createdAt
reviewSchema.index({ status: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review; 