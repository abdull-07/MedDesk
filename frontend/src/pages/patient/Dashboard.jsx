import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API calls
        const appointmentsResponse = await fetch('/api/patient/appointments/upcoming');
        const doctorsResponse = await fetch('/api/patient/doctors/recent');

        const appointments = await appointmentsResponse.json();
        const doctors = await doctorsResponse.json();

        setUpcomingAppointments(appointments);
        setRecentDoctors(doctors);
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

  const quickActions = [
    {
      icon: (
        <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Book Appointment",
      description: "Schedule a new appointment with a doctor",
      to: "/doctors"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: "My Appointments",
      description: "View or manage your appointments",
      to: "/appointments"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: "Write Review",
      description: "Share your experience with doctors",
      to: "/reviews"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 mb-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Welcome Back, {/* TODO: Add patient name */}</h1>

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
              to="/appointments"
              className="text-sm font-medium text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300"
            >
              View all
            </Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <p className="text-[#457B9D] text-sm">No upcoming appointments</p>
          ) : (
            <div className="space-y-4">
              {/* TODO: Add appointment list */}
            </div>
          )}
        </div>

        {/* Recent Doctors */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#1D3557]">Recent Doctors</h2>
            <Link
              to="/doctors"
              className="text-sm font-medium text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300"
            >
              Browse all doctors
            </Link>
          </div>
          {recentDoctors.length === 0 ? (
            <p className="text-[#457B9D] text-sm">No recent doctors</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* TODO: Add doctor cards */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 