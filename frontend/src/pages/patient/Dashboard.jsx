import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { FaCalendarPlus, FaUserMd, FaClipboardList, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const Dashboard = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user name from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserName(user.name || '');

    const fetchDashboardData = async () => {
      try {
        const [appointmentsRes, doctorsRes] = await Promise.all([
          api.get('/appointments', { params: { status: 'upcoming' } }),
          api.get('/doctors/recent')
        ]);

        setUpcomingAppointments(appointmentsRes.data);
        setRecentDoctors(doctorsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const QuickAction = ({ icon, title, description, to }) => (
    <Link
      to={to}
      className="flex items-start space-x-4 p-6 rounded-lg border border-gray-200 hover:border-[#006D77] bg-white hover:bg-[#F8FAFA] hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex-shrink-0">
        <div className="p-3 bg-[#E5F6F8] rounded-lg group-hover:bg-[#006D77] group-hover:text-white transition-all duration-300">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-[#1D3557] group-hover:text-[#006D77] transition-colors duration-300">{title}</h3>
        <p className="text-sm text-[#457B9D]">{description}</p>
      </div>
    </Link>
  );

  const DoctorCard = ({ doctor }) => (
    <Link 
      to={`/patient/doctors/${doctor._id}`}
      className="flex items-center p-4 space-x-4 rounded-lg border border-gray-200 hover:border-[#006D77] bg-white hover:shadow-md transition-all duration-300"
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-[#E5F6F8] rounded-full flex items-center justify-center">
          <FaUserMd className="w-8 h-8 text-[#006D77]" />
        </div>
      </div>
      <div>
        <h4 className="text-lg font-medium text-[#1D3557]">Dr. {doctor.name}</h4>
        <p className="text-sm text-[#457B9D]">{doctor.specialization}</p>
        <p className="text-sm text-[#457B9D]">{doctor.clinicName}</p>
      </div>
    </Link>
  );

  const AppointmentCard = ({ appointment }) => {
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
      <Link
        to={`/patient/appointments/${appointment._id}`}
        className="block p-4 rounded-lg border border-gray-200 hover:border-[#006D77] bg-white hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-medium text-[#1D3557]">Dr. {appointment.doctor.name}</h4>
            <p className="text-sm text-[#457B9D]">{appointment.doctor.specialization}</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <FaClock className="w-4 h-4 mr-2 text-[#006D77]" />
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaCalendarPlus className="w-4 h-4 mr-2 text-[#006D77]" />
                {formatDate(appointment.startTime)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#006D77]" />
                {appointment.doctor.clinicName}
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>
      </Link>
    );
  };

  const quickActions = [
    {
      icon: <FaCalendarPlus className="w-6 h-6" />,
      title: "Book Appointment",
      description: "Schedule a new appointment with a doctor",
      to: "/patient/doctors"
    },
    {
      icon: <FaClipboardList className="w-6 h-6" />,
      title: "My Appointments",
      description: "View or manage your appointments",
      to: "/patient/appointments"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: "Write Review",
      description: "Share your experience with doctors",
      to: "/patient/reviews"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 mb-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Welcome Back, {userName}</h1>

        {/* Quick Actions */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#1D3557]">Upcoming Appointments</h2>
            <Link
              to="/patient/appointments"
              className="text-sm font-medium text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300"
            >
              View all
            </Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <FaCalendarPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-[#457B9D] text-sm">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment._id} appointment={appointment} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Doctors */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#1D3557]">Recent Doctors</h2>
            <Link
              to="/patient/doctors"
              className="text-sm font-medium text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300"
            >
              Browse all doctors
            </Link>
          </div>
          {recentDoctors.length === 0 ? (
            <div className="text-center py-8">
              <FaUserMd className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-[#457B9D] text-sm">No recent doctors</p>
              <Link
                to="/patient/doctors"
                className="inline-block mt-4 px-4 py-2 bg-[#006D77] text-white rounded-md hover:bg-[#005F6B] transition-colors duration-300"
              >
                Find a Doctor
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentDoctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 