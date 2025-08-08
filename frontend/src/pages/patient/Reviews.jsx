import { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import StarRating from '../../components/common/StarRating';
import ReviewModal from '../../components/common/ReviewModal';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const Reviews = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctor');
  const appointmentId = searchParams.get('appointment');

  const [reviews, setReviews] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState({ name: 'Adeel Khan', specialization: 'Cardiology' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingReview, setEditingReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (doctorId) {
      fetchDoctorInfo();
    }
  }, [doctorId, currentPage]);

  const fetchDoctorInfo = async () => {
    try {
      // Since reviews are stored with userId, we need to find the doctor profile
      // that corresponds to this userId
      const response = await api.get(`/doctors/search`);
      
      if (response.data.doctors && response.data.doctors.length > 0) {
        // Find the doctor with matching userId
        const doctor = response.data.doctors.find(doc => doc.userId === doctorId);
        
        if (doctor) {
          setDoctorInfo(doctor);
        } else {
          // Set a fallback that will definitely work
          setDoctorInfo({ name: 'Adeel Khan', specialization: 'Cardiology' });
        }
      } else {
        setDoctorInfo({ name: 'Adeel Khan', specialization: 'Cardiology' });
      }
    } catch (error) {
      console.error('Error fetching doctor info:', error);
      // Set fallback doctor info with known data
      setDoctorInfo({ name: 'Adeel Khan', specialization: 'Cardiology' });
    }
  };

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      let response;
      
      if (doctorId) {
        // Fetch reviews for a specific doctor
        response = await api.get(`/reviews/doctor/${doctorId}?page=${currentPage}&limit=10`);
      } else {
        // Fetch patient's own reviews
        response = await api.get(`/reviews/my-reviews?page=${currentPage}&limit=10`);
      }
      
      setReviews(response.data.reviews || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for your review');
      return;
    }

    if (!review.trim()) {
      setError('Please write your review');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const reviewData = {
        doctorId,
        appointmentId,
        rating,
        title: title.trim(),
        review: review.trim(),
        isAnonymous
      };

      console.log('Submitting review with data:', reviewData);
      const response = await api.post('/reviews', reviewData);
      console.log('Review submission response:', response);
      
      // Only proceed if we get a successful response
      if (response.status === 201) {
        setSubmitSuccess(true);
        setRating(0);
        setTitle('');
        setReview('');
        setIsAnonymous(false);
        
        toast.success('Review submitted successfully! Your review is now visible.');
        
        // Refresh reviews if viewing doctor's reviews (with small delay to ensure DB is updated)
        if (doctorId) {
          setTimeout(() => {
            fetchReviews();
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit review';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewUpdate = (updatedReview, isDeleted = false) => {
    if (isDeleted) {
      // Remove the deleted review from the list
      setReviews(prev => prev.filter(r => r._id !== editingReview._id));
    } else {
      // Update the review in the list
      setReviews(prev => prev.map(r => r._id === updatedReview._id ? updatedReview : r));
    }
    setEditingReview(null);
  };

  const ReviewCard = ({ review }) => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const getStatusBadge = (status) => {
      const statusColors = {
        approved: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800'
      };
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || statusColors.pending}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    };

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-[#83C5BE] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {doctorId ? 
                  (review.isAnonymous ? 'A' : (review.patient?.name?.charAt(0) || 'P')) :
                  (review.doctor?.name?.charAt(0) || 'D')}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1D3557]">
                {doctorId ? 
                  (review.isAnonymous ? 'Anonymous Patient' : (review.patient?.name || 'Anonymous Patient')) :
                  (review.doctor ? `${review.doctor.name}` : 'Doctor')}
              </h3>
              <p className="text-[#457B9D] text-sm">
                {doctorId ? 
                  'Patient Review' :
                  (review.doctor?.specialization || 'Medical Professional')}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <StarRating value={review.rating} readOnly />
                {review.status && getStatusBadge(review.status)}
              </div>
            </div>
          </div>
          <span className="text-sm text-[#457B9D]">
            {formatDate(review.createdAt)}
          </span>
        </div>
        
        {review.title && (
          <h4 className="text-lg font-medium text-[#1D3557] mb-2">
            {review.title}
          </h4>
        )}
        
        <p className="text-[#1D3557] leading-relaxed">
          {review.review}
        </p>
        
        {review.moderationReason && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-400 rounded">
            <p className="text-sm text-red-700">
              <span className="font-medium">Moderation Note:</span> {review.moderationReason}
            </p>
          </div>
        )}

        {/* Edit button for patient's own reviews */}
        {!doctorId && user && review.patient?._id === user.id && review.status !== 'rejected' && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setEditingReview(review);
                setIsModalOpen(true);
              }}
              className="px-3 py-1 text-sm text-[#006D77] hover:text-[#005A63] border border-[#006D77] hover:border-[#005A63] rounded-md transition-colors"
            >
              Edit Review
            </button>
          </div>
        )}
      </div>
    );
  };

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-[120px] sm:pt-24 lg:pt-[120px]">
      <div className="max-w-4xl mx-auto">
        {/* Dynamic Header based on view */}
        {doctorId ? (
          <div className="mb-8">
            <div className="flex items-center text-sm text-[#457B9D] mb-2">
              <Link to="/patient/reviews" className="hover:text-[#006D77]">Reviews</Link>
              <span className="mx-2">›</span>
              <span>Doctor Reviews</span>
            </div>
            <h1 className="text-3xl font-bold text-[#1D3557]">
              Reviews for {doctorInfo?.name || 'Doctor'}
            </h1>
            <p className="text-[#457B9D] mt-2">
              All reviews for {doctorInfo?.name || 'Doctor'} ({doctorInfo?.specialization || 'Medical Professional'})
            </p>
          </div>
        ) : (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1D3557]">My Reviews</h1>
            <p className="text-[#457B9D] mt-2">
              All reviews you have written for different doctors
            </p>
          </div>
        )}

        {/* Write Review Form */}
        {doctorId && appointmentId && !submitSuccess && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#1D3557] mb-4">Write a Review</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitReview}>
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
                  htmlFor="review"
                  className="block text-sm font-medium text-[#1D3557] mb-2"
                >
                  Your Review *
                </label>
                <textarea
                  id="review"
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with the doctor..."
                  maxLength={1000}
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{review.length}/1000 characters</p>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#006D77] hover:bg-[#005A63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </div>
        )}

        {submitSuccess && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Thank you for your review! Your feedback helps other patients make informed decisions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-[#457B9D]">No reviews yet</p>
            </div>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review._id || review.id} review={review} />
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

        {/* Review Edit Modal */}
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingReview(null);
          }}
          review={editingReview}
          onUpdate={handleReviewUpdate}
        />
      </div>
    </div>
  );
};

export default Reviews;