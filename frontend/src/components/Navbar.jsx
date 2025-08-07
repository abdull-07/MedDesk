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
  FaCog
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
    // { to: '/admin/logs', label: 'Logs', icon: FaClipboardList },
    // { to: '/admin/settings', label: 'Settings', icon: FaCog }
  ];

  // Navbar for Docturs
  const doctorLinks = [
    { to: '/doctor/dashboard', label: 'Dashboard' },
    { to: '/doctor/appointments', label: 'Appointments' },
    { to: '/doctor/schedule', label: 'Schedule' },
    { to: '/doctor/patients', label: 'Patients' },
    // { to: '/doctor/profile', label: 'Profile' }
  ];

  // Navbar for patients
  const patientLinks = [
    { to: '/patient/dashboard', label: 'Dashboard' },
    { to: '/patient/doctors', label: 'Find Doctors' },
    { to: '/patient/appointments', label: 'My Appointments' },
    { to: '/patient/reviews', label: 'Reviews' },
    // { to: '/patient/profile', label: 'My Profile' }
  ];


  // Navbar for NON Login or unregister user.
  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/doctors', label: 'Find Doctors' },
    { to: '/contact', label: 'Contact' }
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
    <nav className="bg-[#006D77] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center relative">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold">MedDesk</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {getNavLinks().map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className={`${isAdmin
                  ? 'text-white hover:bg-[#005660] px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center'
                  : 'text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium'}
                  ${location.pathname === link.to ? 'bg-[#005660]' : ''}`}
              >
                {isAdmin && link.icon && <link.icon className="mr-2 h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center space-x-2 ${isAdmin
                  ? 'text-white bg-[#005660] hover:bg-[#004450] px-3 py-2 rounded-md transition-colors duration-200'
                  : 'text-white hover:text-gray-200'
                  }`}
              >
                <FaUserCircle className="h-6 w-6" />
                <span className="font-semibold">
                  {isAdmin ? 'Admin Panel' : user.name || user.role}
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-4 top-16 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {isAdmin ? (
                      <>
                        {/* <Link
                          to="/admin/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaTachometerAlt className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link> */}
                        <Link
                          to="/admin/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaCog className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`/${user.role}/profile`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaUserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/sign-in"
                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="bg-white text-[#006D77] hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {getNavLinks().map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${isAdmin
                    ? 'text-white hover:bg-[#005660] px-4 py-2 rounded-md font-semibold flex items-center'
                    : 'hover:text-[#E5F6F8]'
                    } transition-colors ${location.pathname === link.to ? (isAdmin ? 'bg-[#005660]' : 'text-[#E5F6F8]') : ''
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {isAdmin && link.icon && <link.icon className="mr-2 h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#83C5BE]">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center text-left hover:text-[#E5F6F8] transition-colors"
                >
                  <FaSignOutAlt className="w-5 h-5 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 