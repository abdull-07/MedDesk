const ReviewService = require('../services/review.service');

// Create a new review
const createReview = async (req, res) => {
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
const getDoctorReviews = async (req, res) => {
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
const getPatientReviews = async (req, res) => {
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
const getPendingReviews = async (req, res) => {
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
const moderateReview = async (req, res) => {
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
const updateReview = async (req, res) => {
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
const deleteReview = async (req, res) => {
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

module.exports = {
  createReview,
  getDoctorReviews,
  getPatientReviews,
  getPendingReviews,
  moderateReview,
  updateReview,
  deleteReview
}; 