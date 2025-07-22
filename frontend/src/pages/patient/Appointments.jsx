import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dummyAppointments from '../../assets/appointments';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        try {
          // Try to fetch from API first
          const response = await fetch('/api/patient/appointments');
          const data = await response.json();
          setAppointments(data);
        } catch (apiError) {
          console.log('Using dummy appointments data');
          
          // Process upcoming appointments
          const upcomingAppointmentsData = dummyAppointments.upcoming.map(apt => ({
            id: apt.id,
            doctor: {
              id: apt.id.replace('apt-', 'doc-'),
              name: apt.doctor.replace('Dr. ', ''),
              specialty: apt.specialty,
              image: `https://images.unsplash.com/photo-${1590000000000 + parseInt(apt.id.split('-')[1]) * 1000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80`
            },
            date: apt.date,
            time: apt.time,
            location: apt.location,
            status: apt.status
          }));
          
          // Process past appointments
          const pastAppointmentsData = dummyAppointments.past.map(apt => ({
            id: apt.id,
            doctor: {
              id: apt.id.replace('apt-', 'doc-'),
              name: apt.doctor.replace('Dr. ', ''),
              specialty: apt.specialty,
              image: `https://images.unsplash.com/photo-${1590000000000 + parseInt(apt.id.split('-')[1]) * 1000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80`
            },
            date: apt.date,
            time: apt.time,
            location: apt.location,
            status: apt.status
          }));
          
          // Combine all appointments
          setAppointments([...upcomingAppointmentsData, ...pastAppointmentsData]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
        method: 'POST',
      });

      if (response.ok) {
        setAppointments(appointments.map(apt => 
          apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        ));
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert(error.message);
    }
  };

  const handleRescheduleAppointment = async (appointmentId) => {
    // TODO: Implement rescheduling logic
    // This could open a modal with date/time selection
    console.log('Reschedule appointment:', appointmentId);
  };

  const AppointmentCard = ({ appointment }) => {
    const isUpcoming = new Date(appointment.date) > new Date();
    const isPast = !isUpcoming && appointment.status !== 'cancelled';
    const isCancelled = appointment.status === 'cancelled';

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <img
                src={appointment.doctor.image}
                alt={`Dr. ${appointment.doctor.name}`}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold text-[#1D3557]">
                  Dr. {appointment.doctor.name}
                </h3>
                <p className="text-[#457B9D]">{appointment.doctor.specialty}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-[#457B9D]">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(appointment.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center text-[#457B9D]">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {appointment.time}
              </div>
              <div className="flex items-center text-[#457B9D]">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {appointment.location}
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start md:items-end">
            <div className="mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isCancelled
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
                  onClick={() => handleRescheduleAppointment(appointment.id)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-[#006D77] text-sm font-medium rounded-md text-[#006D77] hover:bg-[#E5F6F8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE] transition-colors duration-300"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => handleCancelAppointment(appointment.id)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-red-500 text-sm font-medium rounded-md text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            )}

            {isPast && (
              <Link
                to={`/reviews?doctor=${appointment.doctor.id}&appointment=${appointment.id}`}
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
    const appointmentDate = new Date(appointment.date);
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
                      ${
                        activeTab === tab
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
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Appointments; 