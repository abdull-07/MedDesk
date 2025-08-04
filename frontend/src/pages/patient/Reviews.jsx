import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import dummyReviews from '../../assets/reviews';
import api from '../../utils/api';

const Reviews = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctor');
  const appointmentId = searchParams.get('appointment');

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        try {
          // Try to fetch from API first
          const response = await fetch('/api/patient/reviews');
          const data = await response.json();
          setReviews(data);
        } catch (apiError) {
          console.log('Using dummy reviews data');
          
          // Process the dummy reviews data
          const formattedReviews = dummyReviews.map(review => {
            return {
              id: review.id,
              rating: review.rating,
              comment: review.comment,
              date: review.date,
              doctor: {
                id: review.id.replace('rev-', 'doc-'),
                name: review.doctor.replace('Dr. ', ''),
                specialty: 'Specialist',
                image: `https://images.unsplash.com/photo-${1590000000000 + parseInt(review.id.split('-')[1]) * 1000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80`
              },
              patient: review.patient
            };
          });
          
          setReviews(formattedReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      try {
        // Try to use the actual API if available
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            doctorId,
            appointmentId,
            rating,
            comment,
          }),
        });

        if (response.ok) {
          setSubmitSuccess(true);
          setRating(0);
          setComment('');
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Failed to submit review');
        }
      } catch (apiError) {
        console.log('Using dummy data for review submission');
        
        // Simulate a successful submission
        setTimeout(() => {
          // Create a new review and add it to the existing reviews
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const patientName = user.name || 'Patient';
          
          const newReview = {
            id: `rev-${dummyReviews.length + 1}`,
            rating: rating,
            comment: comment,
            date: new Date().toISOString().split('T')[0],
            doctor: {
              id: doctorId,
              name: 'Doctor',
              specialty: 'Specialist',
              image: `https://images.unsplash.com/photo-${1590000000000 + (dummyReviews.length + 1) * 1000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80`
            },
            patient: patientName
          };
          
          setReviews(prevReviews => [newReview, ...prevReviews]);
          setSubmitSuccess(true);
          setRating(0);
          setComment('');
        }, 1000); // Simulate network delay
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, readOnly }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={readOnly ? 'button' : 'button'}
            disabled={readOnly}
            onClick={() => onChange && onChange(star)}
            className={`${
              readOnly ? 'cursor-default' : 'cursor-pointer'
            } p-1 focus:outline-none focus:ring-0`}
          >
            <svg
              className={`w-6 h-6 ${
                star <= (value || 0)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const ReviewCard = ({ review }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <img
            src={review.doctor.image}
            alt={`Dr. ${review.doctor.name}`}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-[#1D3557]">
              Dr. {review.doctor.name}
            </h3>
            <p className="text-[#457B9D] text-sm">{review.doctor.specialty}</p>
            <div className="mt-2">
              <StarRating value={review.rating} readOnly />
            </div>
          </div>
        </div>
        <span className="text-sm text-[#457B9D]">{review.date}</span>
      </div>
      <p className="mt-4 text-[#1D3557]">{review.comment}</p>
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
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Reviews</h1>

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
                  Rating
                </label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-[#1D3557] mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with the doctor..."
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                />
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
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews; 