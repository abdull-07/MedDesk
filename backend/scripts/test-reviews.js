import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Review from '../models/review.model.js';
import Appointment from '../models/appointment.model.js';

const testReviewFunctionality = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a doctor and patient
    const doctor = await User.findOne({ role: 'doctor' });
    const patient = await User.findOne({ role: 'patient' });

    if (!doctor || !patient) {
      console.log('Need at least one doctor and one patient in the database');
      return;
    }

    console.log(`Found doctor: ${doctor.name}`);
    console.log(`Found patient: ${patient.name}`);

    // Create a test appointment
    const appointment = new Appointment({
      patient: patient._id,
      doctor: doctor._id,
      date: new Date(),
      time: '10:00',
      status: 'completed',
      type: 'consultation',
      notes: 'Test appointment for review functionality'
    });

    await appointment.save();
    console.log('Created test appointment');

    // Create a test review
    const review = new Review({
      doctor: doctor._id,
      patient: patient._id,
      appointment: appointment._id,
      rating: 5,
      title: 'Excellent Doctor!',
      review: 'Dr. ' + doctor.name + ' was very professional and helpful. Highly recommended!',
      status: 'approved'
    });

    await review.save();
    console.log('Created test review');

    // Update doctor's rating
    await doctor.updateRating(5);
    console.log('Updated doctor rating');

    // Fetch and display the review
    const savedReview = await Review.findById(review._id)
      .populate('doctor', 'name specialization')
      .populate('patient', 'name');

    console.log('\nReview Details:');
    console.log(`Title: ${savedReview.title}`);
    console.log(`Rating: ${savedReview.rating}/5`);
    console.log(`Review: ${savedReview.review}`);
    console.log(`Doctor: ${savedReview.doctor.name}`);
    console.log(`Patient: ${savedReview.patient.name}`);
    console.log(`Status: ${savedReview.status}`);

    // Display updated doctor rating
    const updatedDoctor = await User.findById(doctor._id);
    console.log(`\nDoctor's Updated Rating: ${updatedDoctor.ratings.average}/5 (${updatedDoctor.ratings.count} reviews)`);

    console.log('\nReview functionality test completed successfully!');

  } catch (error) {
    console.error('Error testing review functionality:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the test
testReviewFunctionality();