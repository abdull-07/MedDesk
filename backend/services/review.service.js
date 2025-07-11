const Review = require('../models/review.model');
const User = require('../models/user.model');
const Appointment = require('../models/appointment.model');
const NotificationService = require('./notification.service');

class ReviewService {
  static async createReview(reviewData) {
    try {
      // Check if appointment exists and is completed
      const appointment = await Appointment.findOne({
        _id: reviewData.appointment,
        patient: reviewData.patient,
        doctor: reviewData.doctor,
        status: 'completed'
      });

      if (!appointment) {
        throw new Error('Invalid appointment or appointment not completed');
      }

      // Check if review already exists for this appointment
      const existingReview = await Review.findOne({
        appointment: reviewData.appointment
      });

      if (existingReview) {
        throw new Error('Review already exists for this appointment');
      }

      // Create review
      const review = new Review(reviewData);
      await review.save();

      // Update doctor's rating
      const doctor = await User.findById(reviewData.doctor);
      await doctor.updateRating(reviewData.rating);

      // Create notification for doctor
      await NotificationService.createNotification({
        recipient: reviewData.doctor,
        type: 'REVIEW_RECEIVED',
        title: 'New Review Received',
        message: `A patient has left a ${reviewData.rating}-star review for you`,
        relatedTo: {
          model: 'Review',
          id: review._id
        }
      });

      return review;
    } catch (error) {
      console.error('Create review error:', error);
      throw error;
    }
  }

  static async getDoctorReviews(doctorId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status = 'approved'
      } = options;

      const skip = (page - 1) * limit;

      const query = {
        doctor: doctorId,
        status
      };

      const [reviews, total] = await Promise.all([
        Review.find(query)
          .populate('patient', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Review.countDocuments(query)
      ]);

      // If reviews are anonymous, remove patient names
      const formattedReviews = reviews.map(review => {
        if (review.isAnonymous) {
          review.patient.name = 'Anonymous Patient';
        }
        return review;
      });

      return {
        reviews: formattedReviews,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Get doctor reviews error:', error);
      throw error;
    }
  }

  static async getPatientReviews(patientId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10
      } = options;

      const skip = (page - 1) * limit;

      const query = {
        patient: patientId
      };

      const [reviews, total] = await Promise.all([
        Review.find(query)
          .populate('doctor', 'name specialization')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Review.countDocuments(query)
      ]);

      return {
        reviews,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Get patient reviews error:', error);
      throw error;
    }
  }

  static async getPendingReviews(options = {}) {
    try {
      const {
        page = 1,
        limit = 10
      } = options;

      const skip = (page - 1) * limit;

      const query = {
        status: 'pending'
      };

      const [reviews, total] = await Promise.all([
        Review.find(query)
          .populate('doctor', 'name specialization')
          .populate('patient', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Review.countDocuments(query)
      ]);

      return {
        reviews,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Get pending reviews error:', error);
      throw error;
    }
  }

  static async moderateReview(reviewId, status, moderationReason = null) {
    try {
      const review = await Review.findById(reviewId)
        .populate('doctor', 'name')
        .populate('patient', 'name');

      if (!review) {
        throw new Error('Review not found');
      }

      // Update review status
      review.status = status;
      review.moderationReason = moderationReason;
      await review.save();

      // If rejected, update doctor's rating
      if (status === 'rejected' && review.status === 'approved') {
        const doctor = await User.findById(review.doctor._id);
        doctor.ratings.total -= review.rating;
        doctor.ratings.count -= 1;
        doctor.ratings.average = doctor.ratings.count > 0 
          ? doctor.ratings.total / doctor.ratings.count 
          : 0;
        await doctor.save();
      }

      // Notify patient about moderation result
      await NotificationService.createNotification({
        recipient: review.patient._id,
        type: 'REVIEW_MODERATED',
        title: `Review ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: status === 'approved'
          ? `Your review for Dr. ${review.doctor.name} has been approved`
          : `Your review for Dr. ${review.doctor.name} has been rejected. Reason: ${moderationReason}`,
        relatedTo: {
          model: 'Review',
          id: review._id
        }
      });

      return review;
    } catch (error) {
      console.error('Moderate review error:', error);
      throw error;
    }
  }

  static async updateReview(reviewId, patientId, updateData) {
    try {
      const review = await Review.findOne({
        _id: reviewId,
        patient: patientId,
        status: { $ne: 'rejected' }
      });

      if (!review) {
        throw new Error('Review not found or cannot be updated');
      }

      // If rating is being updated, update doctor's rating
      if (updateData.rating && updateData.rating !== review.rating) {
        const doctor = await User.findById(review.doctor);
        doctor.ratings.total = doctor.ratings.total - review.rating + updateData.rating;
        doctor.ratings.average = doctor.ratings.total / doctor.ratings.count;
        await doctor.save();
      }

      // Update review
      Object.assign(review, updateData, { status: 'pending' });
      await review.save();

      return review;
    } catch (error) {
      console.error('Update review error:', error);
      throw error;
    }
  }

  static async deleteReview(reviewId, patientId) {
    try {
      const review = await Review.findOne({
        _id: reviewId,
        patient: patientId
      });

      if (!review) {
        throw new Error('Review not found');
      }

      // If review was approved, update doctor's rating
      if (review.status === 'approved') {
        const doctor = await User.findById(review.doctor);
        doctor.ratings.total -= review.rating;
        doctor.ratings.count -= 1;
        doctor.ratings.average = doctor.ratings.count > 0 
          ? doctor.ratings.total / doctor.ratings.count 
          : 0;
        await doctor.save();
      }

      await review.deleteOne();

      return { message: 'Review deleted successfully' };
    } catch (error) {
      console.error('Delete review error:', error);
      throw error;
    }
  }
}

module.exports = ReviewService; 