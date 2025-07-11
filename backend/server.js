require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const authRoutes = require('./routes/auth.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const adminRoutes = require('./routes/admin.routes');
const bookingRoutes = require('./routes/booking.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const notificationRoutes = require('./routes/notification.routes');
const doctorRoutes = require('./routes/doctor.routes');
const reviewRoutes = require('./routes/review.routes');
const paymentRoutes = require('./routes/payment.routes');
const ReminderService = require('./services/reminder.service');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));

// Parse JSON payloads
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the User model
    const User = mongoose.model('User');

    // Drop only the problematic index if it exists
    try {
      await User.collection.dropIndex('licenseNumber_1');
      console.log('Old licenseNumber index dropped');
    } catch (error) {
      // Index might not exist, which is fine
      console.log('No old index to drop');
    }

    // Create new indexes based on schema
    await User.init();
    console.log('Indexes created successfully');

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Schedule cron jobs for reminders
const scheduleCronJobs = () => {
  // Daily reminders at 9 AM
  cron.schedule('0 9 * * *', () => {
    console.log('Running daily appointment reminders...');
    ReminderService.sendDailyReminders();
  });

  // Hourly reminders
  cron.schedule('0 * * * *', () => {
    console.log('Running hourly appointment reminders...');
    ReminderService.sendHourlyReminders();
  });
};

// Initialize server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    scheduleCronJobs();
  }); 
}); 

