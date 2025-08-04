import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        // Use the specific doctor endpoint
        const response = await api.get(`/doctors/${id}`);
        const doctorData = response.data;
        
        if (!doctorData) {
          setError('Doctor not found');
          return;
        }

        // Transform the data to match frontend format
        const formattedDoctor = {
          id: doctorData._id,
          name: doctorData.name,
          specialty: doctorData.specialization,
          rating: doctorData.ratings?.average || 0,
          reviewCount: doctorData.ratings?.count || 0,
          location: doctorData.location?.city ? 
            `${doctorData.clinicName}, ${doctorData.location.city}` : 
            doctorData.clinicName || 'Location not specified',
          experience: doctorData.experience || 0,
          consultationFee: doctorData.consultationFee || 100,
          qualifications: doctorData.qualifications,
          about: doctorData.about || 'No information available',
          languages: doctorData.languages || [],
          services: doctorData.services || [],
          image: `https://images.unsplash.com/photo-${1590000000000 + Math.floor(Math.random() * 1000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80`,
          reviews: [] // You can fetch reviews separately if needed
        };
        
        setDoctor(formattedDoctor);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        setError('Failed to load doctor profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [id]);

  // Fetch available slots when date is selected
  useEffect(() => {
    if (selectedDate && doctor) {
      fetchAvailableSlots();
    }
  }, [selectedDate, doctor]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;
    
    setIsLoadingSlots(true);
    setError('');
    
    try {
      const response = await api.get(`/bookings/doctors/${id}/availability?date=${selectedDate}`);
      const { slots } = response.data;
      
      // Format slots for display
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
      
      setAvailableSlots(formattedSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setError('Failed to load available time slots');
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot || !reason.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsBooking(true);
    setError('');

    try {
      // Step 1: Initiate booking
      const bookingData = {
        doctorId: id,
        startTime: selectedSlot.start.toISOString(),
        endTime: selectedSlot.end.toISOString(),
        type: appointmentType,
        reason: reason.trim()
      };

      const initiateResponse = await api.post('/bookings/appointments/initiate', bookingData);
      const { appointment, fee } = initiateResponse.data;

      // Step 2: For now, we'll auto-confirm the booking
      // In a real app, you'd integrate payment processing here
      const confirmResponse = await api.post('/bookings/appointments/confirm', {
        appointmentId: appointment._id,
        paymentDetails: { method: 'cash', status: 'pending' } // Placeholder
      });

      if (confirmResponse.data) {
        setBookingSuccess(true);
        // Reset form
        setSelectedDate('');
        setSelectedSlot(null);
        setReason('');
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const ReviewCard = ({ review }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center mb-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-[#457B9D] ml-2">{review.date}</span>
      </div>
      <p className="text-[#1D3557] mb-2">{review.comment}</p>
      <p className="text-sm text-[#457B9D]">- {review.patientName}</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-[#1D3557] mb-4">Error</h2>
            <p className="text-[#457B9D] mb-6">{error}</p>
            <Link
              to="/doctors"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-[#006D77] hover:bg-[#005A63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE]"
            >
              Back to Doctors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <img
                    src={doctor?.image}
                    alt={`Dr. ${doctor?.name}`}
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#1D3557] mb-2">
                    Dr. {doctor?.name}
                  </h1>
                  <p className="text-lg text-[#457B9D] mb-4">{doctor?.specialty}</p>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < doctor?.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-[#457B9D] ml-2">
                        ({doctor?.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-[#457B9D] mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {doctor?.experience} years of experience
                  </div>
                  <div className="flex items-center text-[#457B9D]">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {doctor?.location}
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-[#1D3557] mb-4">About</h2>
              <p className="text-[#457B9D] whitespace-pre-line">{doctor?.about}</p>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#1D3557]">Patient Reviews</h2>
                <Link
                  to={`/reviews?doctor=${id}`}
                  className="text-sm font-medium text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300"
                >
                  View all reviews
                </Link>
              </div>
              {doctor?.reviews?.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#1D3557]">Book Appointment</h2>
                <Link
                  to={`/patient/book-appointment/${id}`}
                  className="text-sm text-[#006D77] hover:text-[#005A63] font-medium transition-colors"
                >
                  Full Booking Page →
                </Link>
              </div>
              
              {bookingSuccess ? (
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-[#1D3557] mb-2">Appointment Booked!</h3>
                  <p className="text-sm text-[#457B9D] mb-6">
                    Your appointment has been successfully scheduled.
                  </p>
                  <Link
                    to="/appointments"
                    className="text-sm font-medium text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300"
                  >
                    View appointment details
                  </Link>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleBookAppointment(); }}>
                  {error && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="appointmentType" className="block text-sm font-medium text-[#1D3557] mb-1">
                      Appointment Type
                    </label>
                    <select
                      id="appointmentType"
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

                  <div className="mb-4">
                    <label htmlFor="reason" className="block text-sm font-medium text-[#1D3557] mb-1">
                      Reason for Visit
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Please describe your symptoms or reason for the appointment..."
                      className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-[#1D3557] mb-1">
                      Select Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full rounded-lg border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#1D3557] mb-2">
                      Available Time Slots
                    </label>
                    {!selectedDate ? (
                      <p className="text-sm text-[#457B9D] italic">Please select a date first</p>
                    ) : isLoadingSlots ? (
                      <div className="flex items-center justify-center py-4">
                        <svg className="animate-spin h-5 w-5 text-[#006D77]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
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
                            className={`p-2 text-sm rounded-lg border transition-colors duration-200 ${
                              selectedSlot === slot
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

                  <button
                    type="submit"
                    disabled={isBooking || !selectedSlot || !reason.trim()}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#006D77] hover:bg-[#005A63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE] disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {isBooking ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Booking...
                      </>
                    ) : (
                      'Book Appointment'
                    )}
                  </button>

                  <p className="mt-4 text-sm text-[#457B9D] text-center">
                    Consultation fee: ${doctor?.consultationFee}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile; 