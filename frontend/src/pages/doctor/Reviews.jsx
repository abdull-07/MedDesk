import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../utils/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [filter, setFilter] = useState('all'); // 'all', '5', '4', '3', '2', '1'
  const [responseText, setResponseText] = useState('');
  const [respondingTo, setRespondingTo] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Get doctor's reviews
      const response = await api.get('/reviews/doctor/my-reviews');
      const reviewsData = response.data.data || response.data;

      setReviews(reviewsData.reviews || []);
      setStats(reviewsData.stats || {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });

    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = async (reviewId) => {
    try {
      if (!responseText.trim()) return;

      await api.post(`/reviews/${reviewId}/response`, {
        response: responseText.trim()
      });

      // Update the review in local state
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === reviewId
            ? { ...review, doctorResponse: responseText.trim(), responseDate: new Date() }
            : review
        )
      );

      setResponseText('');
      setRespondingTo(null);
    } catch (error) {
      console.error('Error submitting response:', error);
      setError('Failed to submit response. Please try again.');
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.rating === parseInt(filter);
  });

  const StarRating = ({ rating, size = 'sm' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } fill-current`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const RatingDistribution = () => (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = stats.ratingDistribution[rating] || 0;
        const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
        
        return (
          <div key={rating} className="flex items-center space-x-3">
            <span className="text-sm font-medium text-[#1D3557] w-8">{rating}</span>
            <StarRating rating={1} size="sm" />
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-[#457B9D] w-8">{count}</span>
          </div>
        );
      })}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-[120px] sm:pt-24 lg:pt-[120px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#1D3557]">Patient Reviews</h1>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-[#1D3557] mb-4">Review Summary</h2>
              
              {/* Overall Rating */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-[#1D3557] mb-2">
                  {stats.averageRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(stats.averageRating)} size="lg" />
                <p className="text-sm text-[#457B9D] mt-2">
                  Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#1D3557] mb-3">Rating Distribution</h3>
                <RatingDistribution />
              </div>

              {/* Filter Options */}
              <div>
                <h3 className="text-sm font-medium text-[#1D3557] mb-3">Filter Reviews</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      filter === 'all'
                        ? 'bg-[#006D77] text-white'
                        : 'text-[#457B9D] hover:bg-[#E5F6F8]'
                    }`}
                  >
                    All Reviews ({stats.totalReviews})
                  </button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilter(rating.toString())}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${
                        filter === rating.toString()
                          ? 'bg-[#006D77] text-white'
                          : 'text-[#457B9D] hover:bg-[#E5F6F8]'
                      }`}
                    >
                      <span>{rating} Star{rating !== 1 ? 's' : ''}</span>
                      <span>({stats.ratingDistribution[rating] || 0})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {filteredReviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? "You haven't received any patient reviews yet."
                    : `No ${filter}-star reviews found.`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <div key={review._id} className="bg-white rounded-lg shadow-sm p-6">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#006D77] rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {review.patient?.name ? review.patient.name.charAt(0).toUpperCase() : 'P'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-[#1D3557]">
                            {review.patient?.name || 'Anonymous Patient'}
                          </h3>
                          <p className="text-sm text-[#457B9D]">
                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size="md" />
                    </div>

                    {/* Review Content */}
                    <div className="mb-4">
                      <p className="text-[#1D3557] leading-relaxed">{review.review}</p>
                    </div>

                    {/* Doctor Response */}
                    {review.doctorResponse ? (
                      <div className="bg-[#E5F6F8] rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-[#006D77] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-[#006D77]">Your Response</span>
                          <span className="text-xs text-[#457B9D]">
                            {format(new Date(review.responseDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <p className="text-[#1D3557] text-sm">{review.doctorResponse}</p>
                      </div>
                    ) : (
                      /* Response Form */
                      <div className="border-t pt-4">
                        {respondingTo === review._id ? (
                          <div className="space-y-3">
                            <textarea
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Write a professional response to this review..."
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#006D77] focus:border-[#006D77] resize-none"
                              rows={3}
                            />
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleResponse(review._id)}
                                disabled={!responseText.trim()}
                                className="px-4 py-2 bg-[#006D77] text-white rounded-md text-sm font-medium hover:bg-[#005A63] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Submit Response
                              </button>
                              <button
                                onClick={() => {
                                  setRespondingTo(null);
                                  setResponseText('');
                                }}
                                className="px-4 py-2 text-[#457B9D] border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRespondingTo(review._id)}
                            className="text-[#006D77] text-sm font-medium hover:text-[#005A63] flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            <span>Respond to this review</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;