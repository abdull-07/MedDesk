import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import {
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaChartBar,
  FaClipboardList,
  FaCog,
  FaHome,
  FaInfoCircle,
  FaStethoscope,
  FaEnvelope,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaUser,
  FaCalendarAlt,
  FaStar,
  FaCreditCard
} from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch updated profile data for patients
  const fetchUserProfile = async (basicUserData) => {
    if (basicUserData && basicUserData.role === 'patient') {
      try {
        const response = await api.get('/auth/profile');
        if (response.data && response.data.data) {
          // Update localStorage with the latest profile data
          const updatedUserData = {
            ...basicUserData,
            name: response.data.data.name,
            // Add any other fields you want to display in the navbar
          };
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          setUser(updatedUserData);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // If fetch fails, still use the basic user data
        setUser(basicUserData);
      }
    } else {
      // For non-patients, just use the basic user data
      setUser(basicUserData);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Fetch updated profile data for patients
        fetchUserProfile(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]); // Re-check when path changes to update navbar after login/logout

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/sign-in');
  };

  // Navbar for Admins
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { to: '/admin/doctors', label: 'Doctors', icon: FaUserMd },
    { to: '/admin/users', label: 'Users', icon: FaUsers },
    { to: '/admin/appointments', label: 'Appointments', icon: FaCalendarCheck },
    { to: '/admin/reports', label: 'Reports', icon: FaChartBar },
  ];

  // Navbar for Doctors
  const doctorLinks = [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { to: '/doctor/appointments', label: 'Appointments', icon: FaCalendarCheck },
    { to: '/doctor/schedule', label: 'Schedule', icon: FaCalendarAlt },
    { to: '/doctor/patients', label: 'Patients', icon: FaUsers },
  ];

  // Navbar for patients
  const patientLinks = [
    { to: '/patient/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { to: '/patient/doctors', label: 'Find Doctors', icon: FaStethoscope },
    { to: '/patient/appointments', label: 'My Appointments', icon: FaCalendarCheck },
    { to: '/patient/reviews', label: 'Reviews', icon: FaStar },
    // { to: '/payment', label: 'Payment', icon: FaCreditCard },
  ];

  // Navbar for NON Login or unregister user.
  const publicLinks = [
    { to: '/', label: 'Home', icon: FaHome },
    { to: '/about', label: 'About', icon: FaInfoCircle },
    { to: '/doctors', label: 'Find Doctors', icon: FaStethoscope },
    { to: '/contact', label: 'Contact', icon: FaEnvelope },
  ];

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Get the appropriate links based on user role and admin status
  const getNavLinks = () => {
    if (isAdmin) {
      // Only show admin links if user is an admin
      return adminLinks;
    } else if (!user) {
      // Show public links if no user is logged in
      return publicLinks;
    } else {
      // Show role-specific links for other users
      switch (user.role) {
        case 'doctor':
          return doctorLinks;
        case 'patient':
          return patientLinks;
        default:
          return publicLinks;
      }
    }
  };

  // If user is logged in and trying to access home page, redirect to appropriate dashboard
  useEffect(() => {
    if (user && location.pathname === '/') {
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'patient':
          navigate('/patient/dashboard');
          break;
        default:
          break;
      }
    }
  }, [user, location.pathname, navigate]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-lg border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center relative">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaStethoscope className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-teal-600 transition-all duration-300">
                MedDesk
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {getNavLinks().map((link, index) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={index}
                  to={link.to}
                  className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
                    }`}
                >
                  {link.icon && (
                    <link.icon
                      className={`w-4 h-4 transition-colors duration-300 ${isActive
                          ? 'text-white'
                          : 'text-slate-500 group-hover:text-blue-600'
                        }`}
                    />
                  )}
                  <span className="text-sm">{link.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User / Auth Buttons */}
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="group flex items-center space-x-3 bg-white/30 hover:bg-white/50 px-4 py-2 rounded-2xl border border-white/30 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                    <FaUserCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900">
                      {isAdmin ? 'Admin' : user.name || user.role}
                    </div>
                    <div className="text-xs text-slate-500 capitalize">
                      {user.role}
                    </div>
                  </div>
                  <FaChevronDown
                    className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50">
                    <div className="p-2">
                      <div className="px-4 py-3 border-b border-white/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                            <FaUserCircle className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {isAdmin ? 'Administrator' : user.name || user.role}
                            </div>
                            <div className="text-sm text-slate-500 capitalize">
                              {user.role} Account
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        {isAdmin ? (
                          <Link
                            to="/admin/settings"
                            className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-white/40 rounded-xl transition-all duration-200"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <FaCog className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">Settings</span>
                          </Link>
                        ) : (
                          <Link
                            to={`/${user.role}/profile`}
                            className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-white/40 rounded-xl transition-all duration-200"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <FaUser className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">My Profile</span>
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                          <FaSignOutAlt className="w-4 h-4" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                to="/sign-in"
                className="text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl font-medium transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-white/30 hover:bg-white/50 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <FaTimes className="h-5 w-5 text-slate-700" />
            ) : (
              <FaBars className="h-5 w-5 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-blue-100 backdrop-blur-lg border-b border-white/20 shadow-lg">
            <div className="p-4 space-y-2">
              {getNavLinks().map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && (
                      <link.icon
                        className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'
                          }`}
                      />
                    )}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>

  );
};

export default Navbar; 