import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import api from '../../utils/api';

const DoctorReviews = ({ doctorId, showWriteReview = false, appointmentId = null }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  useEffect(() => {
    if (doctorId) {
      fetchReviews();
    }
  }, [doctorId, currentPage]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/reviews/doctor/${doctorId}?page=${currentPage}&limit=5`);
      
      setReviews(response.data.reviews || []);
      setTotalPages(response.data.totalPages || 1);
      
      // Calculate stats from reviews
      const allReviews = response.data.reviews || [];
      if (allReviews.length > 0) {
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / allReviews.length;
        
        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        allReviews.forEach(review => {
          ratingDistribution[review.rating]++;
        });

        setStats({
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: allReviews.length,
          ratingDistribution
        });
      }
    } catch (error) {
      console.error('Error fetching doctor reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const RatingBar = ({ rating, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
      <div className="flex items-center space-x-2 text-sm">
        <span className="w-3">{rating}</span>
        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="w-8 text-right text-gray-600">{count}</span>
      </div>
    );
  };

  const ReviewCard = ({ review }) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-[#83C5BE] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {review.isAnonymous ? 'A' : (review.patient?.name?.charAt(0) || 'P')}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-[#1D3557]">
              {review.isAnonymous ? 'Anonymous Patient' : (review.patient?.name || 'Patient')}
            </h4>
            <div className="mt-1">
              <StarRating value={review.rating} readOnly size="sm" />
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(review.createdAt)}
        </span>
      </div>
      
      {review.title && (
        <h5 className="font-medium text-[#1D3557] mb-2">
          {review.title}
        </h5>
      )}
      
      <p className="text-gray-700 text-sm leading-relaxed">
        {review.review}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-24 mb-4"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats.totalReviews > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1D3557] mb-4">Patient Reviews</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-[#1D3557] mb-2">
                {stats.averageRating}
              </div>
              <StarRating value={Math.round(stats.averageRating)} readOnly />
              <p className="text-sm text-gray-600 mt-2">
                Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <RatingBar
                  key={rating}
                  rating={rating}
                  count={stats.ratingDistribution[rating]}
                  total={stats.totalReviews}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {showWriteReview && appointmentId && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1D3557] mb-4">Share Your Experience</h3>
          <p className="text-gray-600 mb-4">
            Help other patients by sharing your experience with this doctor.
          </p>
          <a
            href={`/patient/reviews?doctor=${doctorId}&appointment=${appointmentId}`}
            className="inline-flex items-center px-4 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005A63] transition-colors"
          >
            Write a Review
          </a>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1D3557] mb-4">
          Recent Reviews
        </h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews yet</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6 pt-6 border-t">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* View All Reviews Link */}
            <div className="text-center mt-6 pt-6 border-t">
              <a
                href={`/patient/reviews?doctor=${doctorId}`}
                className="text-[#006D77] hover:text-[#005A63] font-medium"
              >
                View All Reviews →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorReviews;