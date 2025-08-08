import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const BookAppointment = ({ doctorId, onSuccess, onCancel, isModal = false }) => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Form, 2: Confirmation, 3: Success

  useEffect(() => {
    if (doctorId) {
      fetchDoctorInfo();
    }
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate && doctor) {
      fetchAvailableSlots();
    }
  }, [selectedDate, doctor]);

  const fetchDoctorInfo = async () => {
    try {
      console.log('BookAppointment: Fetching doctor info for ID:', doctorId);
      // Use the same endpoint as DoctorProfile component
      const response = await api.get(`/doctors/${doctorId}`);
      console.log('BookAppointment: Doctor response:', response.data);
      const doctorData = response.data;

      if (doctorData) {
        setDoctor({
          id: doctorData._id,
          name: doctorData.name,
          specialty: doctorData.specialization,
          consultationFee: doctorData.consultationFee || 100,
          clinicName: doctorData.clinicName,
          location: doctorData.location?.city || 'Not specified'
        });
        console.log('BookAppointment: Doctor set successfully');
      } else {
        console.log('BookAppointment: No doctor data returned');
        setError('Doctor not found');
      }
    } catch (error) {
      console.error('BookAppointment: Error fetching doctor info:', error);
      console.error('BookAppointment: Error details:', error.response?.data);
      setError('Failed to load doctor information');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;

    setIsLoadingSlots(true);
    setError('');

    try {
      console.log('BookAppointment: Fetching slots for doctor ID:', doctorId, 'on date:', selectedDate);
      const response = await api.get(`/bookings/doctors/${doctorId}/availability?date=${selectedDate}`);
      console.log('BookAppointment: Availability response:', response.data);
      const { slots } = response.data;

      if (!slots || slots.length === 0) {
        console.log('BookAppointment: No slots returned from backend');
        setAvailableSlots([]);
        return;
      }

      const formattedSlots = slots.map(slot => ({
        start: new Date(slot.start),
        end: new Date(slot.end),
        display: `${new Date(slot.start).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })} - ${new Date(slot.end).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}`
      }));

      console.log('BookAppointment: Formatted slots:', formattedSlots);
      setAvailableSlots(formattedSlots);
    } catch (error) {
      console.error('BookAppointment: Error fetching available slots:', error);
      console.error('BookAppointment: Error details:', error.response?.data);
      setError('Failed to load available time slots');
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedSlot || !reason.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setStep(2); // Move to confirmation step
  };

  const confirmBooking = async () => {
    setIsBooking(true);
    setError('');

    try {
      // Step 1: Initiate booking
      const bookingData = {
        doctorId,
        startTime: selectedSlot.start.toISOString(),
        endTime: selectedSlot.end.toISOString(),
        type: appointmentType,
        reason: reason.trim()
      };

      const initiateResponse = await api.post('/bookings/appointments/initiate', bookingData);
      const { appointment } = initiateResponse.data;

      // Step 2: Confirm booking (auto-confirm for now)
      const confirmResponse = await api.post('/bookings/appointments/confirm', {
        appointmentId: appointment._id,
        paymentDetails: { method: 'cash', status: 'pending' }
      });

      if (confirmResponse.data) {
        setStep(3); // Move to success step
        if (onSuccess) {
          onSuccess(confirmResponse.data.appointment);
        }
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || 'Failed to book appointment. Please try again.');
      setStep(1); // Go back to form
    } finally {
      setIsBooking(false);
    }
  };

  const resetForm = () => {
    setSelectedDate('');
    setSelectedSlot(null);
    setReason('');
    setAppointmentType('consultation');
    setAvailableSlots([]);
    setStep(1);
    setError('');
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (!isModal) {
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006D77]"></div>
        <span className="ml-2 text-[#457B9D]">Loading...</span>
      </div>
    );
  }

  const containerClass = isModal
    ? "bg-white rounded-lg p-6 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto"
    : "min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pt-[120px] sm:pt-24 lg:pt-[120px]";

  return (
    <div className={containerClass}>
      {!isModal && (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button
              onClick={handleCancel}
              className="flex items-center text-[#457B9D] hover:text-[#006D77] transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
        </div>
      )}

      <div className={isModal ? "" : "max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6"}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1D3557] mb-2">Book Appointment</h1>
          {doctor && (
            <div className="text-[#457B9D]">
              <p className="font-medium">{doctor.name}</p>
              <p className="text-sm">{doctor.specialty} • {doctor.clinicName}</p>
              <p className="text-sm">Consultation Fee: ${doctor.consultationFee}</p>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-[#006D77] text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-[#006D77]' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-[#006D77] text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              2
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-[#006D77]' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-[#006D77] text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              3
            </div>
          </div>
          <div className="flex justify-between text-xs text-[#457B9D] mt-2">
            <span>Details</span>
            <span>Confirm</span>
            <span>Success</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Booking Form */}
        {step === 1 && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1D3557] mb-1">
                  Appointment Type
                </label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  required
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D3557] mb-1">
                  Reason for Visit *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe your symptoms or reason for the appointment..."
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D3557] mb-1">
                  Select Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1D3557] mb-2">
                  Available Time Slots *
                </label>
                {!selectedDate ? (
                  <p className="text-sm text-[#457B9D] italic">Please select a date first</p>
                ) : isLoadingSlots ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#006D77]"></div>
                    <span className="ml-2 text-sm text-[#457B9D]">Loading slots...</span>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-[#457B9D] italic">No available slots for this date</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 text-sm rounded-lg border transition-colors duration-200 ${selectedSlot === slot
                          ? 'bg-[#006D77] text-white border-[#006D77]'
                          : 'bg-white text-[#1D3557] border-gray-300 hover:border-[#006D77] hover:bg-[#F1FAEE]'
                          }`}
                      >
                        {slot.display}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-[#457B9D] hover:text-[#006D77] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedSlot || !reason.trim()}
                className="px-6 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005A63] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-[#1D3557] mb-4">Confirm Your Appointment</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-[#457B9D]">Doctor:</span>
                <span className="font-medium text-[#1D3557]">{doctor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#457B9D]">Specialty:</span>
                <span className="font-medium text-[#1D3557]">{doctor?.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#457B9D]">Date:</span>
                <span className="font-medium text-[#1D3557]">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#457B9D]">Time:</span>
                <span className="font-medium text-[#1D3557]">{selectedSlot?.display}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#457B9D]">Type:</span>
                <span className="font-medium text-[#1D3557] capitalize">{appointmentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#457B9D]">Fee:</span>
                <span className="font-medium text-[#1D3557]">${doctor?.consultationFee}</span>
              </div>
              <div className="pt-2 border-t">
                <span className="text-[#457B9D]">Reason:</span>
                <p className="text-[#1D3557] mt-1">{reason}</p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-[#457B9D] hover:text-[#006D77] transition-colors"
              >
                Back
              </button>
              <button
                onClick={confirmBooking}
                disabled={isBooking}
                className="px-6 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005A63] disabled:opacity-50 transition-colors flex items-center"
              >
                {isBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-[#1D3557] mb-2">Appointment Booked Successfully!</h3>
            <p className="text-sm text-[#457B9D] mb-6">
              Your appointment with Dr. {doctor?.name} has been confirmed for{' '}
              {new Date(selectedDate).toLocaleDateString()} at {selectedSlot?.display}.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/patient/appointments')}
                className="px-4 py-2 bg-[#006D77] text-white rounded-lg hover:bg-[#005A63] transition-colors"
              >
                View Appointments
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 text-[#457B9D] hover:text-[#006D77] transition-colors"
              >
                Book Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;