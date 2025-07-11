import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import nodeCron from 'node-cron';
import authRoutes from './routes/auth.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import adminRoutes from './routes/admin.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import reviewRoutes from './routes/review.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import ReminderService from './services/reminder.service.js';

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
  nodeCron.schedule('0 9 * * *', () => {
    console.log('Running daily appointment reminders...');
    ReminderService.sendDailyReminders();
  });

  // Hourly reminders
  nodeCron.schedule('0 * * * *', () => {
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

