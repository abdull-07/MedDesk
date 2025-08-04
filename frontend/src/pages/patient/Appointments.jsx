import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments');
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch available slots when date changes in reschedule modal
  useEffect(() => {
    if (newDate && selectedAppointment && showRescheduleModal) {
      fetchAvailableSlots();
    }
  }, [newDate, selectedAppointment, showRescheduleModal]);

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
    setCancelReason('');
  };

  const handleCancelConfirm = async () => {
    if (!cancelReason.trim()) {
      return;
    }

    setIsCancelling(true);
    try {
      await api.post(`/appointments/${selectedAppointment._id}/cancel`, { reason: cancelReason });

      // Update the local state
      setAppointments(appointments.map(apt =>
        apt._id === selectedAppointment._id ? { ...apt, status: 'cancelled', cancellationReason: cancelReason } : apt
      ));

      setShowCancelModal(false);
      setSelectedAppointment(null);
      setCancelReason('');

      // Show success toast
      showToast('Appointment cancelled successfully!', 'success');
    } catch (error) {
      console.error('Error cancelling appointment:', error);

      // Show error toast
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel appointment';
      showToast(errorMessage, 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setSelectedAppointment(null);
    setCancelReason('');
  };

  const fetchAvailableSlots = async () => {
    if (!newDate || !selectedAppointment) return;

    setIsLoadingSlots(true);
    try {
      // The appointment stores the doctor's user ID, but we need the doctor profile ID
      const doctorUserId = selectedAppointment.doctor._id;
      console.log('Doctor user ID from appointment:', doctorUserId);
      console.log('Selected appointment:', selectedAppointment);

      // Get the doctor profile using the new endpoint
      const doctorProfileResponse = await api.get(`/bookings/doctors/by-user/${doctorUserId}`);
      console.log('Doctor profile response:', doctorProfileResponse.data);

      const doctorProfile = doctorProfileResponse.data;

      if (!doctorProfile) {
        console.error('Doctor profile not found for user ID:', doctorUserId);
        setAvailableSlots([]);
        return;
      }

      // Now get the available slots using the doctor profile ID
      const response = await api.get(`/bookings/doctors/${doctorProfile._id}/availability?date=${newDate}`);
      console.log('Slots API response:', response.data);

      const { slots } = response.data;

      if (!slots || slots.length === 0) {
        console.log('No slots returned from API');
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

      console.log('Formatted slots:', formattedSlots);
      setAvailableSlots(formattedSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      console.error('Error details:', error.response?.data);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
    // Set current appointment date as default
    const currentDate = new Date(appointment.startTime);
    setNewDate(currentDate.toISOString().split('T')[0]);
    setSelectedSlot(null);
    setAvailableSlots([]);
  };

  const handleRescheduleConfirm = async () => {
    if (!selectedSlot) {
      return;
    }

    setIsRescheduling(true);
    try {
      console.log('Rescheduling appointment:', selectedAppointment._id);
      console.log('New times:', {
        startTime: selectedSlot.start.toISOString(),
        endTime: selectedSlot.end.toISOString()
      });

      const response = await api.post(`/appointments/${selectedAppointment._id}/reschedule`, {
        startTime: selectedSlot.start.toISOString(),
        endTime: selectedSlot.end.toISOString()
      });

      console.log('Reschedule response:', response.data);

      // Update the local state
      setAppointments(appointments.map(apt =>
        apt._id === selectedAppointment._id
          ? { ...apt, startTime: selectedSlot.start.toISOString(), endTime: selectedSlot.end.toISOString() }
          : apt
      ));

      // Close modal and reset state
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setNewDate('');
      setSelectedSlot(null);
      setAvailableSlots([]);

      // Show success toast
      showToast('Appointment rescheduled successfully!', 'success');

    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      console.error('Error details:', error.response?.data);

      // Show error toast
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reschedule appointment';
      showToast(errorMessage, 'error');
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleRescheduleModalClose = () => {
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
    setNewDate('');
    setSelectedSlot(null);
    setAvailableSlots([]);
  };

  // Toast functions
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };


  const AppointmentCard = ({ appointment }) => {
    const isUpcoming = new Date(appointment.startTime) > new Date();
    const isPast = !isUpcoming && appointment.status !== 'cancelled';
    const isCancelled = appointment.status === 'cancelled';

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#E5F6F8] rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1D3557]">
                  {appointment.doctor.name}
                </h3>
                <p className="text-[#457B9D]">{appointment.doctor.specialization}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-[#457B9D]">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(appointment.startTime)}
              </div>
              <div className="flex items-center text-[#457B9D]">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </div>
              <div className="flex items-center text-[#457B9D]">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {appointment.doctor.clinicName || 'Clinic location'}
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start md:items-end">
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isCancelled
                  ? 'bg-red-100 text-red-800'
                  : isPast
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-green-100 text-green-800'
                  }`}
              >
                {isCancelled ? 'Cancelled' : isPast ? 'Completed' : 'Upcoming'}
              </span>
            </div>

            {isUpcoming && !isCancelled && (
              <div className="flex flex-col space-y-2 w-full md:w-auto">
                <button
                  onClick={() => handleRescheduleClick(appointment)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-[#006D77] text-sm font-medium rounded-md text-[#006D77] hover:bg-[#E5F6F8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE] transition-colors duration-300"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => handleCancelClick(appointment)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-red-500 text-sm font-medium rounded-md text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            )}

            {isPast && (
              <Link
                to={`/reviews?doctor=${appointment.doctor._id}&appointment=${appointment._id}`}
                className="inline-flex items-center justify-center px-4 py-2 border border-[#006D77] text-sm font-medium rounded-md text-[#006D77] hover:bg-[#E5F6F8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE] transition-colors duration-300"
              >
                Write Review
              </Link>
            )}
          </div>
        </div>
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

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.startTime);
    const isUpcoming = appointmentDate > new Date();

    if (activeTab === 'upcoming') {
      return isUpcoming && appointment.status !== 'cancelled';
    } else if (activeTab === 'past') {
      return !isUpcoming && appointment.status !== 'cancelled';
    } else {
      return appointment.status === 'cancelled';
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">My Appointments</h1>

        {error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {['upcoming', 'past', 'cancelled'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === tab
                        ? 'border-[#006D77] text-[#006D77]'
                        : 'border-transparent text-[#457B9D] hover:text-[#1D3557] hover:border-gray-300'
                      }
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-[#457B9D]">No {activeTab} appointments</p>
                {activeTab === 'upcoming' && (
                  <Link
                    to="/doctors"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#006D77] hover:bg-[#005A63] mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE]"
                  >
                    Book an Appointment
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard key={appointment._id} appointment={appointment} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Cancel Appointment Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#1D3557]">Cancel Appointment</h3>
                <button
                  onClick={handleCancelModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedAppointment && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Doctor:</span>  {selectedAppointment.doctor.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(selectedAppointment.startTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Time:</span> {new Date(selectedAppointment.startTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Please provide a reason for cancellation:
                </label>
                <textarea
                  id="cancelReason"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#006D77] focus:border-[#006D77]"
                  placeholder="Enter your reason for cancelling this appointment..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelModalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isCancelling}
                >
                  Keep Appointment
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={!cancelReason.trim() || isCancelling}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCancelling ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cancelling...
                    </div>
                  ) : (
                    'Cancel Appointment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Appointment Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#1D3557]">Reschedule Appointment</h3>
                <button
                  onClick={handleRescheduleModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedAppointment && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Doctor:</span>  {selectedAppointment.doctor.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Current Date:</span> {new Date(selectedAppointment.startTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Current Time:</span> {new Date(selectedAppointment.startTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="newDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Select New Date:
                  </label>
                  <input
                    type="date"
                    id="newDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#006D77] focus:border-[#006D77]"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots:
                  </label>
                  {!newDate ? (
                    <p className="text-sm text-[#457B9D] italic">Please select a date first</p>
                  ) : isLoadingSlots ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#006D77]"></div>
                      <span className="ml-2 text-sm text-[#457B9D]">Loading available slots...</span>
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

                {selectedSlot && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">New appointment time:</span>
                    </p>
                    <p className="text-sm text-blue-800">
                      {new Date(selectedSlot.start).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {selectedSlot.display}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleRescheduleModalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isRescheduling}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleConfirm}
                  disabled={!selectedSlot || isRescheduling}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#006D77] border border-transparent rounded-md hover:bg-[#005F6B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRescheduling ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Rescheduling...
                    </div>
                  ) : (
                    'Reschedule Appointment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`w-80 bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${toast.type === 'success' ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'
            }`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {toast.type === 'success' ? (
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-900' : 'text-red-900'
                    }`}>
                    {toast.type === 'success' ? 'Success' : 'Error'}
                  </p>
                  <p className={`mt-1 text-sm ${toast.type === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}>
                    {toast.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className={`rounded-md inline-flex ${toast.type === 'success' ? 'text-green-400 hover:text-green-500' : 'text-red-400 hover:text-red-500'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${toast.type === 'success' ? 'focus:ring-green-500' : 'focus:ring-red-500'
                      }`}
                    onClick={() => setToast({ show: false, message: '', type: '' })}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments; 