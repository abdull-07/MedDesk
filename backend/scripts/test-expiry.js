import 'dotenv/config';
import mongoose from 'mongoose';
import ExpiryService from '../services/expiry.service.js';

// Test script to verify expiry functionality
const testExpiry = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('\n=== Testing Expiry Service ===\n');

    // Test 1: Check for expired appointments
    console.log('1. Checking for expired appointments...');
    const result = await ExpiryService.processExpiredAppointments();
    console.log(`   - Processed: ${result.processed} appointments`);
    console.log(`   - Details:`, result.appointments);

    // Test 2: Get appointments expiring soon
    console.log('\n2. Getting appointments expiring in next 60 minutes...');
    const expiring = await ExpiryService.getExpiringAppointments(60);
    console.log(`   - Found: ${expiring.length} appointments expiring soon`);
    
    if (expiring.length > 0) {
      expiring.forEach((apt, index) => {
        console.log(`   - ${index + 1}. Patient: ${apt.patient?.name}, Doctor: ${apt.doctor?.name}, End: ${apt.endTime}`);
      });
    }

    // Test 3: Get appointments expiring in next 24 hours
    console.log('\n3. Getting appointments expiring in next 24 hours...');
    const expiringDay = await ExpiryService.getExpiringAppointments(1440);
    console.log(`   - Found: ${expiringDay.length} appointments expiring in 24 hours`);

    console.log('\n=== Test Complete ===');

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the test
testExpiry();