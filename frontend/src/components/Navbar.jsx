import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaBell, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for user data in localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/sign-in');
  };

  const patientLinks = [
    { to: '/patient/dashboard', label: 'Home' },
    { to: '/patient/doctors', label: 'Find Doctors' },
    { to: '/patient/appointments', label: 'My Appointments' },
    { to: '/patient/reviews', label: 'Reviews' }
  ];

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/patient/doctors', label: 'Find Doctors' },
    { to: '/contact', label: 'Contact' }
  ];

  // If user is logged in and trying to access home page, redirect to dashboard
  useEffect(() => {
    if (user && location.pathname === '/') {
      navigate('/patient/dashboard');
    }
  }, [user, location.pathname, navigate]);

  return (
    <nav className="bg-[#006D77] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to={user ? '/patient/dashboard' : '/'} className="text-2xl font-bold">
            MedDesk
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {(user ? patientLinks : publicLinks).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`hover:text-[#E5F6F8] transition-colors ${
                  location.pathname === link.to ? 'text-[#E5F6F8]' : ''
                }`}
              >
                {link.label}
            </Link>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <Link
                    to="/patient/notifications"
                    className="hover:text-[#E5F6F8] transition-colors"
                  >
                    <FaBell className="w-6 h-6" />
                  </Link>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 hover:text-[#E5F6F8] transition-colors focus:outline-none"
                  >
                    <FaUserCircle className="w-6 h-6" />
                    <span>{user.name}</span>
                  </button>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUserCircle className="w-5 h-5 mr-2" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="w-5 h-5 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
            <Link
              to="/sign-in"
              className="hover:text-[#E5F6F8] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/doctor/sign-up"
              className="bg-white text-[#006D77] px-4 py-2 rounded hover:bg-[#E5F6F8] transition-colors"
            >
              Join as Doctor
            </Link>
              </>
            )}
          </div>

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
              {(user ? patientLinks : publicLinks).map((link) => (
              <Link
                  key={link.to}
                  to={link.to}
                  className={`hover:text-[#E5F6F8] transition-colors ${
                    location.pathname === link.to ? 'text-[#E5F6F8]' : ''
                  }`}
                onClick={() => setIsOpen(false)}
              >
                  {link.label}
              </Link>
              ))}
              {user ? (
                <>
              <Link
                    to="/patient/notifications"
                    className="hover:text-[#E5F6F8] transition-colors pt-4 border-t border-[#83C5BE]"
                onClick={() => setIsOpen(false)}
              >
                    Notifications
              </Link>
              <Link
                    to="/profile"
                className="hover:text-[#E5F6F8] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                    My Profile
              </Link>
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
                </>
              ) : (
              <div className="pt-4 border-t border-[#83C5BE]">
                <Link
                  to="/sign-in"
                  className="block hover:text-[#E5F6F8] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/doctor/sign-up"
                  className="block mt-4 bg-white text-[#006D77] px-4 py-2 rounded text-center hover:bg-[#E5F6F8] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Join as Doctor
                </Link>
              </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 