import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  profilePicture: {
    url: {
      type: String,
      default: null
    },
    public_id: {
      type: String,
      default: null
    }
  },
  // Doctor specific fields
  specialization: {
    type: String,
    required: function() { return this.role === 'doctor'; },
    default: null
  },
  qualifications: {
    type: String,
    required: function() { return this.role === 'doctor'; },
    default: null
  },
  clinicName: {
    type: String,
    required: function() { return this.role === 'doctor'; },
    default: null
  },
  experience: {
    type: Number,
    required: function() { return this.role === 'doctor'; },
    min: 0,
    default: null
  },
  licenseNumber: {
    type: String,
    required: function() { return this.role === 'doctor'; },
    index: {
      unique: true,
      partialFilterExpression: { role: 'doctor' }  // Only enforce uniqueness for doctors
    },
    default: null
  },
  isVerified: {
    type: Boolean,
    default: function() {
      return this.role !== 'doctor'; // true for patients, false for doctors
    }
  },
  // Doctor search and filtering fields
  ratings: {
    total: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    average: {
      type: Number,
      default: 0
    }
  },
  consultationFee: {
    type: Number,
    min: 500,
    max: 5000,
    default: 1500
  },
  languages: [{
    type: String,
    trim: true
  }],
  about: {
    type: String,
    trim: true,
    maxLength: 1000
  },
  services: [{
    type: String,
    trim: true
  }],
  location: {
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for search
userSchema.index({ 'name': 'text', 'specialization': 'text', 'about': 'text', 'services': 'text' });
userSchema.index({ 'location.coordinates': '2dsphere' });
userSchema.index({ experience: -1 });

// Pre-save middleware to handle doctor-specific fields
userSchema.pre('save', function(next) {
  if (this.role !== 'doctor') {
    this.specialization = null;
    this.qualifications = null;
    this.clinicName = null;
    this.experience = null;
    this.licenseNumber = null;
    this.consultationFee = null;
    this.languages = [];
    this.about = null;
    this.services = [];
    this.location = {};
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to update user's rating
userSchema.methods.updateRating = async function(newRating) {
  this.ratings.total += newRating;
  this.ratings.count += 1;
  this.ratings.average = this.ratings.total / this.ratings.count;
  await this.save();
};

const User = mongoose.model('User', userSchema);

export default User;