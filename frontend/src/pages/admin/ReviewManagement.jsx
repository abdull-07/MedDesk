import React, { useState, useEffect } from 'react';
import StarRating from '../../components/common/StarRating';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [moderationReason, setModerationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPendingReviews();
  }, [currentPage]);

  const fetchPendingReviews = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/reviews/pending?page=${currentPage}&limit=10`);
      setReviews(response.data.reviews || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      toast.error('Failed to load pending reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeration = async (reviewId, status) => {
    if (status === 'rejected' && !moderationReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setIsSubmitting(true);

    try {
      const moderationData = {
        status,
        reason: status === 'rejected' ? moderationReason.trim() : undefined
      };

      await api.patch(`/reviews/${reviewId}/moderate`, moderationData);
      
      toast.success(`Review ${status} successfully!`);
      
      // Remove the moderated review from the list
      setReviews(prev => prev.filter(review => review._id !== reviewId));
      setSelectedReview(null);
      setModerationReason('');
    } catch (error) {
      console.error('Error moderating review:', error);
      const errorMessage = error.response?.data?.message || 'Failed to moderate review';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ReviewCard = ({ review }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-[#83C5BE] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {review.patient?.name?.charAt(0) || 'P'}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1D3557]">
              {review.isAnonymous ? 'Anonymous Patient' : review.patient?.name}
            </h3>
            <p className="text-[#457B9D] text-sm">
              Review for Dr. {review.doctor?.name}
            </p>
            <div className="mt-2">
              <StarRating value={review.rating} readOnly />
            </div>
          </div>
        </div>
        <span className="text-sm text-[#457B9D]">
          {formatDate(review.createdAt)}
        </span>
      </div>
      
      <h4 className="text-lg font-medium text-[#1D3557] mb-2">
        {review.title}
      </h4>
      
      <p className="text-[#1D3557] leading-relaxed mb-4">
        {review.review}
      </p>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setSelectedReview(review)}
          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Reject
        </button>
        <button
          onClick={() => handleModeration(review._id, 'approved')}
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          Approve
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-40 mb-4"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Review Management</h1>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-[#457B9D]">No pending reviews</p>
            </div>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === page
                      ? 'bg-[#006D77] text-white'
                      : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Rejection Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#1D3557]">Reject Review</h2>
                  <button
                    onClick={() => {
                      setSelectedReview(null);
                      setModerationReason('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Review: "{selectedReview.title}"
                  </p>
                  <p className="text-sm text-gray-500">
                    By: {selectedReview.isAnonymous ? 'Anonymous Patient' : selectedReview.patient?.name}
                  </p>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="moderationReason"
                    className="block text-sm font-medium text-[#1D3557] mb-2"
                  >
                    Reason for Rejection *
                  </label>
                  <textarea
                    id="moderationReason"
                    rows={3}
                    value={moderationReason}
                    onChange={(e) => setModerationReason(e.target.value)}
                    placeholder="Please provide a reason for rejecting this review..."
                    className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setSelectedReview(null);
                      setModerationReason('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleModeration(selectedReview._id, 'rejected')}
                    disabled={isSubmitting || !moderationReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Rejecting...' : 'Reject Review'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;