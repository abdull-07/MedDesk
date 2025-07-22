import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter';
import { isValidEmail, validateName, validatePassword } from '../../utils/validation';
import api from '../../utils/api';

const PatientSignUp = () => {
  // We're handling authentication directly in this component
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form on data change
  useEffect(() => {
    const validateForm = () => {
      const nameValidation = validateName(formData.name);
      const passwordValidation = validatePassword(formData.password);
      
      const errors = {
        name: touched.name ? nameValidation.message : '',
        email: touched.email && !isValidEmail(formData.email) ? 'Please enter a valid email address' : '',
        password: touched.password ? passwordValidation.message : ''
      };
      
      setFormErrors(errors);
      
      // Check if form is valid
      const valid = 
        nameValidation.isValid && 
        isValidEmail(formData.email) && 
        passwordValidation.isValid;
      
      setIsFormValid(valid);
    };
    
    validateForm();
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  // Navigation is handled with the useNavigate hook defined above
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    setTouched({
      name: true,
      email: true,
      password: true
    });
    
    // Don't submit if form is invalid
    if (!isFormValid) {
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      // Make the API call directly instead of using the AuthContext function
      await api.post('/auth/patient/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // Show success toast
      toast.success('Account created successfully! Please sign in to continue.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Clear form data after successful registration
      setFormData({
        name: '',
        email: '',
        password: ''
      });
      
      // Navigate to sign-in page with the email pre-filled
      setTimeout(() => {
        navigate('/sign-in', { 
          state: { 
            registrationSuccess: true,
            email: formData.email 
          }
        });
      }, 1500); // Slightly longer delay to ensure toast is visible
      
    } catch (err) {
      console.error('Registration error:', err);
      
      // Extract the error message from the response
      let errorMessage = 'Registration failed. Please try again.';
      
      // Handle different error response formats
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Show error toast
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Patient Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/sign-in" className="font-medium text-[#1D3557] hover:text-[#457B9D]">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Full Name</span>
                {touched.name && (
                  formErrors.name ? 
                    <span className="text-red-500 text-xs flex items-center">
                      <FaTimes className="mr-1" /> Invalid
                    </span> : 
                    <span className="text-green-500 text-xs flex items-center">
                      <FaCheck className="mr-1" /> Valid
                    </span>
                )}
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  // placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    touched.name && formErrors.name 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-[#1D3557] focus:border-[#1D3557]'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
                />
                {touched.name && formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Email address</span>
                {touched.email && (
                  formErrors.email ? 
                    <span className="text-red-500 text-xs flex items-center">
                      <FaTimes className="mr-1" /> Invalid
                    </span> : 
                    <span className="text-green-500 text-xs flex items-center">
                      <FaCheck className="mr-1" /> Valid
                    </span>
                )}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  // placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    touched.email && formErrors.email 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-[#1D3557] focus:border-[#1D3557]'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
                />
                {touched.email && formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Password</span>
                {touched.password && (
                  formErrors.password ? 
                    <span className="text-red-500 text-xs flex items-center">
                      <FaTimes className="mr-1" /> Invalid
                    </span> : 
                    <span className="text-green-500 text-xs flex items-center">
                      <FaCheck className="mr-1" /> Valid
                    </span>
                )}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  // placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    touched.password && formErrors.password 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-[#1D3557] focus:border-[#1D3557]'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password strength meter */}
              <PasswordStrengthMeter password={formData.password} />
              
              {touched.password && formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1D3557] hover:bg-[#457B9D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D3557] disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              
              {/* Form validation status */}
              {!isFormValid && Object.values(touched).some(t => t) && (
                <div className="mt-2 text-sm text-center text-red-600">
                  Please fix the errors above to continue
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientSignUp; 