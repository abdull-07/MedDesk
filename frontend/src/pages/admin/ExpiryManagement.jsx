import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../utils/api';

const ExpiryManagement = () => {
  const [expiringAppointments, setExpiringAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [minutesAhead, setMinutesAhead] = useState(60);

  const fetchExpiringAppointments = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await api.get(`/expiry/expiring?minutes=${minutesAhead}`);
      setExpiringAppointments(response.data.appointments || []);

    } catch (error) {
      console.error('Error fetching expiring appointments:', error);
      setError('Failed to load expiring appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerExpiryCheck = async () => {
    try {
      setIsProcessing(true);
      setError('');
      setSuccess('');

      const response = await api.post('/expiry/check');
      
      setSuccess(`Expiry check completed. ${response.data.processed} appointments processed.`);
      
      // Refresh the expiring appointments list
      await fetchExpiringAppointments();

    } catch (error) {
      console.error('Error triggering expiry check:', error);
      setError('Failed to process expired appointments');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchExpiringAppointments();
  }, [minutesAhead]);

  const formatAppointmentDateTime = (dateValue) => {
    try {
      if (!dateValue) return 'Date not available';
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date error';
    }
  };

  const getTimeUntilExpiry = (endTime) => {
    try {
      const now = new Date();
      const end = new Date(endTime);
      const diffMs = end.getTime() - now.getTime();
      
      if (diffMs <= 0) return 'Expired';
      
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      
      if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes % 60}m`;
      } else {
        return `${diffMinutes}m`;
      }
    } catch (error) {
      return 'Unknown';
    }
  };

  const AppointmentCard = ({ appointment }) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-green-100 text-green-800',
    };

    const timeUntilExpiry = getTimeUntilExpiry(appointment.endTime);
    const isExpired = timeUntilExpiry === 'Expired';

    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${isExpired ? 'border-red-500' : 'border-yellow-500'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="ml-0">
              <h3 className="text-lg font-medium text-[#1D3557]">
                {appointment.patient?.name || 'Unknown Patient'}
              </h3>
              <p className="text-sm text-[#457B9D]">
                with Dr. {appointment.doctor?.name || 'Unknown Doctor'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[appointment.status] || 'bg-gray-100 text-gray-800'}`}
            >
              {appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : 'Unknown'}
            </span>
            <p className={`text-sm mt-1 font-medium ${isExpired ? 'text-red-600' : 'text-yellow-600'}`}>
              {isExpired ? 'Expired' : `Expires in ${timeUntilExpiry}`}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-[#457B9D]">Start Time</p>
            <p className="font-medium text-[#1D3557]">
              {formatAppointmentDateTime(appointment.startTime)}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#457B9D]">End Time</p>
            <p className="font-medium text-[#1D3557]">
              {formatAppointmentDateTime(appointment.endTime)}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#457B9D]">Type</p>
            <p className="font-medium text-[#1D3557]">{appointment.type || 'General Consultation'}</p>
          </div>
          <div>
            <p className="text-sm text-[#457B9D]">Patient Email</p>
            <p className="font-medium text-[#1D3557]">{appointment.patient?.email || 'N/A'}</p>
          </div>
        </div>
        
        {appointment.reason && (
          <div className="mb-4">
            <p className="text-sm text-[#457B9D]">Reason</p>
            <p className="text-[#1D3557]">{appointment.reason}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-[120px] sm:pt-24 lg:pt-[120px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#1D3557]">Expiry Management</h1>
          <button
            onClick={triggerExpiryCheck}
            disabled={isProcessing}
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-300 ${
              isProcessing
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[#006D77] text-white hover:bg-[#005c66]'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Run Expiry Check'}
          </button>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-8 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#1D3557] mb-2">Appointment Expiry Settings</h2>
              <p className="text-[#457B9D]">View appointments that will expire within the specified time frame</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-[#1D3557]">Minutes ahead:</label>
              <select
                value={minutesAhead}
                onChange={(e) => setMinutesAhead(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006D77] focus:border-transparent"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={360}>6 hours</option>
                <option value={720}>12 hours</option>
                <option value={1440}>24 hours</option>
              </select>
              <button
                onClick={fetchExpiringAppointments}
                disabled={isLoading}
                className="px-4 py-2 bg-[#83C5BE] text-white rounded-md hover:bg-[#6db4c4] transition-colors duration-300"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#1D3557] mb-4">
            Appointments Expiring Soon ({expiringAppointments.length})
          </h2>
          <p className="text-[#457B9D] mb-6">
            These appointments will expire within the next {minutesAhead} minutes if not completed or rescheduled.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : expiringAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#457B9D] text-lg">No appointments expiring soon</p>
            <p className="text-[#457B9D] text-sm mt-2">All appointments are either completed, cancelled, or have sufficient time remaining.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {expiringAppointments.map((appointment) => (
              <AppointmentCard key={appointment._id} appointment={appointment} />
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Automatic Processing:</strong> The system automatically checks for expired appointments every 15 minutes and moves them to the 'Cancelled' status with the reason 'Appointment Expired'. You can also manually trigger this process using the "Run Expiry Check" button above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiryManagement;