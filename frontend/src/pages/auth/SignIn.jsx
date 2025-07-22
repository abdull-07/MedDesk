import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheck, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/validation';

const SignIn = () => {
  const { signIn, error: authError } = useAuth();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  
  const [touched, setTouched] = useState({
    email: location.state?.email ? true : false,
    password: false,
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Check if user was redirected from registration
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage('Account created successfully! Please sign in to continue.');
    }
  }, [location.state]);
  
  // Validate form on data change
  useEffect(() => {
    const validateForm = () => {
      const errors = {
        email: touched.email && !isValidEmail(formData.email) ? 'Please enter a valid email address' : '',
        password: touched.password && !formData.password ? 'Password is required' : '',
      };
      
      setFormErrors(errors);
      
      // Check if form is valid
      const valid = isValidEmail(formData.email) && formData.password.length > 0;
      setIsFormValid(valid);
    };
    
    validateForm();
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    setTouched({
      email: true,
      password: true
    });
    
    // Don't submit if form is invalid
    if (!isFormValid) {
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      // Navigation is handled in the AuthContext
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || authError || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E5F6F8] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-[#1D3557] mb-2">
            Welcome Back
          </h2>
          <p className="text-lg text-[#457B9D]">
            Sign in to continue to MedDesk
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          {successMessage && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-md" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1D3557] mb-1 flex items-center justify-between">
                <span>Email Address</span>
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
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  touched.email && formErrors.email 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]'
                } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300`}
                // placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1D3557] mb-1 flex items-center justify-between">
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
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    touched.password && formErrors.password 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-[#006D77] focus:border-[#006D77]'
                  } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300`}
                  // placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
              {touched.password && formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#006D77] focus:ring-[#83C5BE] border-gray-300 rounded transition-colors duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#457B9D]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#006D77] hover:bg-[#005A63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#83C5BE] disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
            
            {/* Form validation status */}
            {!isFormValid && Object.values(touched).some(t => t) && (
              <div className="mt-2 text-sm text-center text-red-600">
                Please enter a valid email and password to continue
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#457B9D]">
              Don't have an account?{' '}
              <Link
                to="/sign-up"
                className="font-medium text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 