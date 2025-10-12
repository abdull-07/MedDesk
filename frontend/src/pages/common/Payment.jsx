import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/currency';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    // Get appointment details from location state or fetch from API
    if (location.state?.appointment) {
      setAppointment(location.state.appointment);
    } else {
      // TODO: Fetch appointment details from API using ID from URL params
      // For now, using mock data
      setAppointment({
        id: '123',
        doctor: {
          name: 'Dr. John Doe',
          specialty: 'Cardiology',
          image: 'https://example.com/doctor.jpg',
        },
        date: '2024-03-20',
        time: '10:00 AM',
        type: 'Consultation',
        fee: 2000,
      });
    }
  }, [location]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Create payment request to backend using our api instance
      const response = await api.post('/payments/jazzcash/create', {
        appointmentId: appointment.id,
        amount: appointment.fee,
        currency: 'PKR',
        description: `Consultation with ${appointment.doctor.name}`,
        customerEmail: 'customer@example.com', // TODO: Get from user context
        customerPhone: '03001234567', // TODO: Get from user context
      });

      if (response.data.redirectUrl && response.data.formData) {
        // Create form element
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = response.data.redirectUrl;

        // Add all form fields from the response
        Object.entries(response.data.formData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        // Add form to body and submit
        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error('Invalid payment response from server');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Something went wrong with the payment');
    } finally {
      setIsLoading(false);
    }
  };

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Payment Details</h1>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Appointment Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#1D3557] mb-6">Appointment Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center">
                <img
                  src={appointment.doctor.image}
                  alt={appointment.doctor.name}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/48';
                  }}
                />
                <div className="ml-4">
                  <p className="font-medium text-[#1D3557]">{appointment.doctor.name}</p>
                  <p className="text-sm text-[#457B9D]">{appointment.doctor.specialty}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#457B9D]">{appointment.type}</p>
                <p className="text-sm font-medium text-[#1D3557]">
                  {appointment.date} at {appointment.time}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 border-b border-gray-200">
              <div>
                <p className="text-[#457B9D]">Consultation Fee</p>
                <p className="text-sm text-[#457B9D]">Including all taxes</p>
              </div>
              <p className="text-xl font-semibold text-[#1D3557]">
                {formatCurrency(appointment.fee)}
              </p>
            </div>

            <div className="bg-[#E5F6F8] p-4 rounded-lg">
              <h3 className="font-medium text-[#1D3557] mb-2">Payment Information</h3>
              <ul className="text-sm text-[#457B9D] space-y-2">
                <li>• Your payment will be processed securely through JazzCash</li>
                <li>• We accept JazzCash Mobile Account, Credit/Debit Cards, and Bank Transfer</li>
                <li>• You'll receive a confirmation email after successful payment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 border border-[#006D77] text-[#006D77] rounded-lg hover:bg-[#E5F6F8] transition-colors duration-300"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handlePayment}
            disabled={isLoading}
            className={`w-full sm:w-auto px-6 py-3 bg-[#006D77] text-white rounded-lg hover:bg-[#005c66] transition-colors duration-300 flex items-center justify-center ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Pay {formatCurrency(appointment.fee)}
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment; 