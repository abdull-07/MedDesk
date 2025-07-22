import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    upcomingAppointments: 0,
    averageRating: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API calls
        const [statsResponse, appointmentsResponse] = await Promise.all([
          fetch('/api/doctor/stats'),
          fetch('/api/doctor/appointments/today')
        ]);

        const statsData = await statsResponse.json();
        const appointmentsData = await appointmentsResponse.json();

        setStats(statsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, bgColor }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-full p-3 ${bgColor}`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-[#457B9D]">{title}</p>
          <p className="text-2xl font-semibold text-[#1D3557] mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  const AppointmentCard = ({ appointment }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center">
        <img
          src={appointment.patient.avatar}
          alt={appointment.patient.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <h3 className="text-lg font-medium text-[#1D3557]">
            {appointment.patient.name}
          </h3>
          <p className="text-sm text-[#457B9D]">{appointment.type}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-[#1D3557]">{appointment.time}</p>
        <p className="text-sm text-[#457B9D] mt-1">
          {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
        </p>
      </div>
    </div>
  );

  const QuickAction = ({ icon, title, description, to }) => (
    <Link
      to={to}
      className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-[#006D77] bg-white hover:shadow-md transition-all duration-300"
    >
      <div className="flex-shrink-0">
        <div className="p-3 bg-[#E5F6F8] rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-[#1D3557]">{title}</h3>
        <p className="text-sm text-[#457B9D]">{description}</p>
      </div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6 mb-8 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Doctor Dashboard</h1>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            bgColor="bg-blue-100"
          />
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            bgColor="bg-green-100"
          />
          <StatCard
            title="Upcoming Appointments"
            value={stats.upcomingAppointments}
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            bgColor="bg-purple-100"
          />
          <StatCard
            title="Average Rating"
            value={`${stats.averageRating}/5`}
            icon={
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
            bgColor="bg-yellow-100"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Today's Schedule */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#1D3557]">Today's Schedule</h2>
              <Link
                to="/doctor/appointments"
                className="text-sm font-medium text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300"
              >
                View all appointments
              </Link>
            </div>
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <p className="text-[#457B9D]">No appointments scheduled for today</p>
                </div>
              ) : (
                appointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-[#1D3557] mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <QuickAction
                icon={
                  <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                title="Manage Schedule"
                description="Update your availability and working hours"
                to="/doctor/schedule"
              />
              <QuickAction
                icon={
                  <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                title="View Patients"
                description="Access your patient records and history"
                to="/doctor/patients"
              />
              <QuickAction
                icon={
                  <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Update Profile"
                description="Edit your professional information"
                to="/doctor/profile"
              />
              <QuickAction
                icon={
                  <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                }
                title="Notifications"
                description="View appointment requests and updates"
                to="/notifications"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 