import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, required: true, trim: true },
  qualifications: { type: String, required: true, trim: true },
  experience: { type: Number, required: true, min: 0 },
  licenseNumber: { type: String, required: true, unique: true, trim: true },
  clinicName: { type: String, required: true, trim: true },
  consultationFee: { type: Number, min: 500, max: 5000, default: 1500 },
  services: [{ type: String, trim: true }],
  education: [{ degree: { type: String, trim: true }, institution: { type: String, trim: true }, year: { type: Number } }],
  certifications: [{ 
    name: { type: String, trim: true },
    issuingOrganization: { type: String, trim: true },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    certificationNumber: { type: String, trim: true }
  }],
  about: { type: String, trim: true, maxLength: 1000 },
  location: {
    address: { type: String, trim: true }, city: { type: String, trim: true }, state: { type: String, trim: true }, country: { type: String, trim: true }, zipCode: { type: String, trim: true }, coordinates: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0, 0] } }
  },
  contactInfo: { phone: { type: String, trim: true }, email: { type: String, trim: true }, website: { type: String, trim: true } },
  availability: {
    type: Map, of: { isAvailable: Boolean, slots: [{ startTime: String, endTime: String }] },
    default: {
      monday: { isAvailable: false, slots: [] },
      tuesday: { isAvailable: false, slots: [] },
      wednesday: { isAvailable: false, slots: [] },
      thursday: { isAvailable: false, slots: [] },
      friday: { isAvailable: false, slots: [] },
      saturday: { isAvailable: false, slots: [] },
      sunday: { isAvailable: false, slots: [] }
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create indexes for search
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ 'location.city': 1, 'location.state': 1, 'location.country': 1 });
doctorSchema.index({ 'location.coordinates': '2dsphere' });
doctorSchema.index({ experience: -1 });

// Update the updatedAt field before saving
doctorSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;