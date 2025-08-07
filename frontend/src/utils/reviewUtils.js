// Utility functions for review operations

export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / reviews.length) * 10) / 10;
};

export const getRatingDistribution = (reviews) => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  if (!reviews || reviews.length === 0) return distribution;
  
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++;
    }
  });
  
  return distribution;
};

export const formatReviewDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

export const getReviewStatusColor = (status) => {
  const statusColors = {
    approved: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };
  
  return statusColors[status] || statusColors.pending;
};

export const validateReviewData = (reviewData) => {
  const errors = {};
  
  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    errors.rating = 'Please select a rating between 1 and 5 stars';
  }
  
  if (!reviewData.title || reviewData.title.trim().length === 0) {
    errors.title = 'Please provide a title for your review';
  } else if (reviewData.title.trim().length > 100) {
    errors.title = 'Title must be 100 characters or less';
  }
  
  if (!reviewData.review || reviewData.review.trim().length === 0) {
    errors.review = 'Please write your review';
  } else if (reviewData.review.trim().length > 1000) {
    errors.review = 'Review must be 1000 characters or less';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const canEditReview = (review, currentUser) => {
  if (!review || !currentUser) return false;
  
  // Only the patient who wrote the review can edit it
  if (review.patient?._id !== currentUser.id && review.patient?.id !== currentUser.id) {
    return false;
  }
  
  // Cannot edit rejected reviews
  if (review.status === 'rejected') {
    return false;
  }
  
  return true;
};

export const getReviewSummaryText = (averageRating, totalReviews) => {
  if (totalReviews === 0) {
    return 'No reviews yet';
  }
  
  const ratingText = averageRating >= 4.5 ? 'Excellent' :
                    averageRating >= 4.0 ? 'Very Good' :
                    averageRating >= 3.5 ? 'Good' :
                    averageRating >= 3.0 ? 'Average' :
                    averageRating >= 2.0 ? 'Below Average' : 'Poor';
  
  return `${ratingText} (${averageRating}/5 from ${totalReviews} review${totalReviews !== 1 ? 's' : ''})`;
};