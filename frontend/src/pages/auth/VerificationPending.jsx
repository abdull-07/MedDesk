import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaCalendarAlt, FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';

const VerificationPending = () => {
  const navigate = useNavigate();
  const [pendingUser, setPendingUser] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Calculate estimated verification date (2 business days from registration)
  const calculateEstimatedVerificationDate = (createdAt) => {
    const registrationDate = new Date(createdAt);
    
    // Add 2 business days (skip weekends)
    let businessDaysToAdd = 2;
    const estimatedDate = new Date(registrationDate);
    
    while (businessDaysToAdd > 0) {
      estimatedDate.setDate(estimatedDate.getDate() + 1);
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (estimatedDate.getDay() !== 0 && estimatedDate.getDay() !== 6) {
        businessDaysToAdd--;
      }
    }
    
    // Set time to end of business day (5:00 PM)
    estimatedDate.setHours(17, 0, 0, 0);
    
    return estimatedDate;
  };
  
  // Calculate time remaining until verification
  const calculateTimeRemaining = (estimatedDate) => {
    const now = new Date();
    const difference = estimatedDate - now;
    
    // If the estimated date has passed, return zeros
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };
  
  useEffect(() => {
    // Get pending user from localStorage
    const storedPendingUser = localStorage.getItem('pendingUser');
    
    if (!storedPendingUser) {
      // If no pending user, redirect to sign in
      navigate('/sign-in');
      return;
    }
    
    const user = JSON.parse(storedPendingUser);
    setPendingUser(user);
    
    // Calculate estimated verification date
    const estimatedDate = calculateEstimatedVerificationDate(user.createdAt);
    
    // Update countdown timer every second
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(estimatedDate));
    }, 1000);
    
    // Clean up timer
    return () => clearInterval(timer);
  }, [navigate]);
  
  // Format date to display
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (!pendingUser) {
    return null; // Will redirect in useEffect
  }
  
  // Calculate estimated verification date
  const estimatedDate = calculateEstimatedVerificationDate(pendingUser.createdAt);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verification Pending
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Your doctor account is awaiting verification
          </p>
        </div>
        
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-blue-50">
            <h3 className="text-lg leading-6 font-medium text-blue-900">
              Verification Status
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-blue-700">
              Your account is being reviewed by our admin team
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{pendingUser.name}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{pendingUser.email}</dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-500" />
                  Estimated Verification By
                </dt>
                <dd className="mt-1 text-sm text-gray-900 font-semibold">
                  {formatDate(estimatedDate)}
                </dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <FaHourglassHalf className="mr-2 text-blue-500" />
                  Time Remaining
                </dt>
                <dd className="mt-3">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-2xl font-bold text-blue-700">{timeRemaining.days}</div>
                      <div className="text-xs text-blue-600">Days</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-2xl font-bold text-blue-700">{timeRemaining.hours}</div>
                      <div className="text-xs text-blue-600">Hours</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-2xl font-bold text-blue-700">{timeRemaining.minutes}</div>
                      <div className="text-xs text-blue-600">Minutes</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="text-2xl font-bold text-blue-700">{timeRemaining.seconds}</div>
                      <div className="text-xs text-blue-600">Seconds</div>
                    </div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6 bg-gray-50">
            <div className="text-sm">
              <div className="flex items-center mb-4 text-gray-600">
                <FaCheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>We'll notify you by email once your account is verified</span>
              </div>
              
              <p className="text-gray-500 mb-4">
                Verification typically takes up to 2 business days. If you have any questions or need assistance, please contact our support team.
              </p>
              
              <div className="mt-6 flex justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;