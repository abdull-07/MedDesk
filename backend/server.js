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
import patientRoutes from './routes/patient.routes.js';
import ReminderService from './services/reminder.service.js';

const app = express();

// CORS configuration
const whitelist = [
  'https://med-desk-one.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://meddesk-backend.onrender.com',
  'https://meddesk-l85w.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  maxAge: 86400
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options('*', cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Global middleware
app.use(express.urlencoded({ extended: true }));

// Custom middleware for handling JSON parsing
app.use((req, res, next) => {
  // Skip JSON parsing for webhook routes
  if (req.originalUrl === '/api/payments/webhook' || req.originalUrl === '/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Add security headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes - both with and without /api prefix for flexibility
const apiPrefixes = ['', '/api'];

apiPrefixes.forEach(prefix => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.use(`${prefix}/doctors`, doctorRoutes);
  app.use(`${prefix}/patients`, patientRoutes);
  app.use(`${prefix}/appointments`, appointmentRoutes);
  app.use(`${prefix}/bookings`, bookingRoutes);
  app.use(`${prefix}/schedules`, scheduleRoutes);
  app.use(`${prefix}/notifications`, notificationRoutes);
  app.use(`${prefix}/reviews`, reviewRoutes);
  app.use(`${prefix}/payments`, paymentRoutes);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

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

