import ReviewService from '../services/review.service.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentId,
      rating,
      title,
      review,
      isAnonymous
    } = req.body;

    if (!doctorId || !appointmentId || !rating || !title || !review) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    const reviewData = {
      doctor: doctorId,
      patient: req.user.id,
      appointment: appointmentId,
      rating: Number(rating),
      title,
      review,
      isAnonymous: Boolean(isAnonymous)
    };

    const newReview = await ReviewService.createReview(reviewData);

    res.status(201).json({
      message: 'Review submitted successfully',
      review: newReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    if (error.message.includes('already exists')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('Invalid appointment')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get doctor's reviews
export const getDoctorReviews = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const reviews = await ReviewService.getDoctorReviews(req.params.doctorId, {
      page,
      limit,
      status
    });

    res.json(reviews);
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get patient's reviews
export const getPatientReviews = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const reviews = await ReviewService.getPatientReviews(req.user.id, {
      page,
      limit
    });

    res.json(reviews);
  } catch (error) {
    console.error('Get patient reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get pending reviews (admin only)
export const getPendingReviews = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const reviews = await ReviewService.getPendingReviews({
      page,
      limit
    });

    res.json(reviews);
  } catch (error) {
    console.error('Get pending reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Moderate review (admin only)
export const moderateReview = async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status provided'
      });
    }

    if (status === 'rejected' && !reason) {
      return res.status(400).json({
        message: 'Rejection reason is required'
      });
    }

    const review = await ReviewService.moderateReview(
      req.params.reviewId,
      status,
      reason
    );

    res.json({
      message: `Review ${status} successfully`,
      review
    });
  } catch (error) {
    console.error('Moderate review error:', error);
    if (error.message === 'Review not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const {
      rating,
      title,
      review,
      isAnonymous
    } = req.body;

    if (!rating && !title && !review && isAnonymous === undefined) {
      return res.status(400).json({
        message: 'No update data provided'
      });
    }

    const updateData = {};
    if (rating) updateData.rating = Number(rating);
    if (title) updateData.title = title;
    if (review) updateData.review = review;
    if (isAnonymous !== undefined) updateData.isAnonymous = Boolean(isAnonymous);

    const updatedReview = await ReviewService.updateReview(
      req.params.reviewId,
      req.user.id,
      updateData
    );

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    await ReviewService.deleteReview(req.params.reviewId, req.user.id);

    res.json({
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    if (error.message === 'Review not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}; 
// Get doctor's own reviews with stats
export const getDoctorMyReviews = async (req, res) => {
  try {
    // First, get the doctor profile to get the doctor ID
    const Doctor = (await import('../models/doctor.model.js')).default;
    const doctor = await Doctor.findOne({ userId: req.user.id });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const { page = 1, limit = 10, rating } = req.query;
    
    // Build filter
    const filter = { doctor: doctor._id, status: 'approved' };
    if (rating) {
      filter.rating = parseInt(rating);
    }

    console.log('Doctor profile ID:', doctor._id);
    console.log('User ID (doctor):', req.user.id);
    console.log('Fetching reviews for doctor...');

    // Use the user ID (not doctor profile ID) since reviews reference the User collection
    const reviews = await ReviewService.getDoctorReviews(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
      status: ['approved', 'pending'], // Include both approved and pending reviews
      rating: rating ? parseInt(rating) : undefined
    });

    console.log('Reviews fetched:', reviews.reviews.length);

    // Calculate stats
    const allReviews = await ReviewService.getDoctorReviews(req.user.id, {
      page: 1,
      limit: 1000, // Get all reviews for stats
      status: ['approved', 'pending'] // Include both approved and pending reviews
    });

    console.log('All reviews for stats:', allReviews.reviews.length);

    const totalReviews = allReviews.reviews.length;
    const averageRating = totalReviews > 0 
      ? allReviews.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    // Calculate rating distribution
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    const stats = {
      averageRating,
      totalReviews,
      ratingDistribution
    };

    console.log('Final stats:', stats);

    res.json({
      success: true,
      data: {
        reviews: reviews.reviews,
        stats,
        pagination: reviews.pagination
      }
    });

  } catch (error) {
    console.error('Get doctor my reviews error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Add doctor response to a review
export const addDoctorResponse = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;

    if (!response || !response.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Response text is required'
      });
    }

    // First, get the doctor profile to verify ownership
    const Doctor = (await import('../models/doctor.model.js')).default;
    const doctor = await Doctor.findOne({ userId: req.user.id });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    // Get the review and verify it belongs to this doctor
    const Review = (await import('../models/review.model.js')).default;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only respond to your own reviews'
      });
    }

    if (review.doctorResponse) {
      return res.status(400).json({
        success: false,
        message: 'You have already responded to this review'
      });
    }

    // Add the response
    review.doctorResponse = response.trim();
    review.responseDate = new Date();
    await review.save();

    res.json({
      success: true,
      message: 'Response added successfully',
      data: {
        doctorResponse: review.doctorResponse,
        responseDate: review.responseDate
      }
    });

  } catch (error) {
    console.error('Add doctor response error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};