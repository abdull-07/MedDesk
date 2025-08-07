import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    pendingVerifications: 0,
    totalAppointments: 0,
    activeUsers: 0,
    systemHealth: 100,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [statsResponse, activitiesResponse] = await Promise.all([
          fetch('/api/admin/stats', { headers }),
          fetch('/api/admin/recent-activities', { headers })
        ]);

        if (!statsResponse.ok || !activitiesResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const statsData = await statsResponse.json();
        const activitiesData = await activitiesResponse.json();

        // Validate and set the stats data
        setStats({
          totalUsers: statsData.totalUsers || 0,
          totalDoctors: statsData.totalDoctors || 0,
          pendingVerifications: statsData.pendingVerifications || 0,
          totalAppointments: statsData.totalAppointments || 0,
          activeUsers: statsData.activeUsers || 0,
          systemHealth: statsData.systemHealth || 100,
        });

        // Ensure recentActivities is always an array
        setRecentActivities(Array.isArray(activitiesData) ? activitiesData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, bgColor, textColor }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-full p-3 ${bgColor}`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-[#457B9D]">{title}</p>
          <p className={`text-2xl font-semibold ${textColor} mt-1`}>{value}</p>
        </div>
      </div>
    </div>
  );

  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case 'user':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'doctor':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'appointment':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const ActivityItem = ({ activity }) => (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150">
      <div className={`flex-shrink-0 rounded-full p-2 ${activity.bgColor}`}>
        {getActivityIcon(activity.iconType)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1D3557]">{activity.title}</p>
        <p className="text-sm text-[#457B9D] truncate">{activity.description}</p>
      </div>
      <div className="flex-shrink-0">
        <p className="text-sm text-[#457B9D]">{activity.time}</p>
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
            <div className="grid gap-6 mb-8 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Admin Dashboard</h1>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
          <StatCard
            title="Total Doctors"
            value={stats.totalDoctors}
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            bgColor="bg-green-100"
            textColor="text-green-600"
          />
          <StatCard
            title="Pending Verifications"
            value={stats.pendingVerifications}
            icon={
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            bgColor="bg-yellow-100"
            textColor="text-yellow-600"
          />
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            bgColor="bg-purple-100"
            textColor="text-purple-600"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
            bgColor="bg-indigo-100"
            textColor="text-indigo-600"
          />
          <StatCard
            title="System Health"
            value={`${stats.systemHealth}%`}
            icon={
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            bgColor="bg-emerald-100"
            textColor="text-emerald-600"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Recent Activities */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#1D3557]">Recent Activities</h2>
              <Link
                to="/admin/logs"
                className="text-sm font-medium text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300"
              >
                View all logs
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-sm">
              {recentActivities.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-[#457B9D]">No recent activities</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
                title="Manage Users"
                description="View and manage user accounts"
                to="/admin/users"
              />
              <QuickAction
                icon={
                  <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                title="Verify Doctors"
                description="Review and approve doctor registrations"
                to="/admin/doctors"
              />
              <QuickAction
                icon={
                  <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                title="View Reports"
                description="Access system statistics and analytics"
                to="/admin/reports"
              />
              <QuickAction
                icon={
                  <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="View Appointments"
                description="Monitor all appointments in the system"
                to="/admin/appointments"
              />
              <QuickAction
                icon={
                  <svg className="w-6 h-6 text-[#006D77]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                title="View Audit Logs"
                description="Check system activity and audit trails"
                to="/admin/logs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 