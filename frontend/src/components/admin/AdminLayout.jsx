import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaUsers, 
  FaUserMd, 
  FaCalendarCheck, 
  FaChartBar, 
  FaList,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarLinks = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <FaChartLine /> },
    { path: '/admin/users', name: 'Users', icon: <FaUsers /> },
    { path: '/admin/doctors', name: 'Doctors', icon: <FaUserMd /> },
    { path: '/admin/appointments', name: 'Appointments', icon: <FaCalendarCheck /> },
    { path: '/admin/reports', name: 'Reports', icon: <FaChartBar /> },
    { path: '/admin/logs', name: 'System Logs', icon: <FaList /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-[#1D3557] text-white">
          <div className="flex items-center justify-center h-16 bg-[#152A45]">
            <span className="text-xl font-bold">MedDesk Admin</span>
          </div>
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === link.path
                      ? 'bg-[#457B9D] text-white'
                      : 'text-gray-300 hover:bg-[#2A4A73] hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-[#2A4A73] hover:text-white transition-colors"
              >
                <FaSignOutAlt className="mr-3 text-lg" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex flex-col w-full max-w-xs pt-5 pb-4 bg-[#1D3557] h-full">
            <div className="absolute top-0 right-0 pt-2 mr-2">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-md text-gray-300 hover:text-white focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center justify-center h-16">
              <span className="text-xl font-bold text-white">MedDesk Admin</span>
            </div>
            <div className="flex-1 h-0 mt-5 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === link.path
                        ? 'bg-[#457B9D] text-white'
                        : 'text-gray-300 hover:bg-[#2A4A73] hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3 text-lg">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="p-4 mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-[#2A4A73] hover:text-white transition-colors"
                >
                  <FaSignOutAlt className="mr-3 text-lg" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <div className="relative z-10 flex flex-shrink-0 h-16 bg-white shadow">
          <button
            className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#457B9D] md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars className="w-6 h-6" />
          </button>
          <div className="flex justify-between flex-1 px-4">
            <div className="flex flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 my-auto">
                {sidebarLinks.find(link => link.path === location.pathname)?.name || 'Admin Panel'}
              </h1>
            </div>
          </div>
        </div>

        <main className="relative flex-1 overflow-y-auto focus:outline-none bg-gray-100">
          <div className="py-6">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;