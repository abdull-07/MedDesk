import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#006D77] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            MedDesk
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-[#E5F6F8] transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-[#E5F6F8] transition-colors">
              About
            </Link>
            <Link to="/patient/doctors" className="hover:text-[#E5F6F8] transition-colors">
              Find Doctors
            </Link>
            <Link to="/contact" className="hover:text-[#E5F6F8] transition-colors">
              Contact
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
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
              <Link
                to="/"
                className="hover:text-[#E5F6F8] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="hover:text-[#E5F6F8] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/patient/doctors"
                className="hover:text-[#E5F6F8] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Find Doctors
              </Link>
              <Link
                to="/contact"
                className="hover:text-[#E5F6F8] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 