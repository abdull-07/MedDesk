import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const ReviewModal = ({ isOpen, onClose, review, onUpdate }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setTitle(review.title || '');
      setReviewText(review.review || '');
      setIsAnonymous(review.isAnonymous || false);
    }
  }, [review]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for your review');
      return;
    }

    if (!reviewText.trim()) {
      setError('Please write your review');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const updateData = {
        rating,
        title: title.trim(),
        review: reviewText.trim(),
        isAnonymous
      };

      const response = await api.patch(`/reviews/${review._id}`, updateData);
      
      toast.success('Review updated successfully!');
      onUpdate(response.data.review);
      onClose();
    } catch (error) {
      console.error('Error updating review:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update review';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);

    try {
      await api.delete(`/reviews/${review._id}`);
      toast.success('Review deleted successfully!');
      onUpdate(null, true); // Signal deletion
      onClose();
    } catch (error) {
      console.error('Error deleting review:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete review';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#1D3557]">Edit Review</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1D3557] mb-2">
                Rating *
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-[#1D3557] mb-2"
              >
                Review Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief title for your review..."
                maxLength={100}
                className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="reviewText"
                className="block text-sm font-medium text-[#1D3557] mb-2"
              >
                Your Review *
              </label>
              <textarea
                id="reviewText"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with the doctor..."
                maxLength={1000}
                className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">{reviewText.length}/1000 characters</p>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-gray-300 text-[#006D77] focus:ring-[#006D77]"
                />
                <span className="ml-2 text-sm text-[#1D3557]">
                  Submit this review anonymously
                </span>
              </label>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                Delete Review
              </button>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005A63] focus:outline-none focus:ring-2 focus:ring-[#83C5BE] disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Review'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;