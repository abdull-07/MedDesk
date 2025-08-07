import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (token && user) {
          setCurrentUser(user);
          // If user is verified, clear any pending user data
          if (user.isVerified) {
            localStorage.removeItem('pendingUser');
          }
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('pendingUser');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      let response;
      let isAdmin = false;
      let isPendingVerification = false;

      // Define dummy doctor credentials with verification status
      const dummyDoctors = [
        {
          email: 'doctor@example.com',
          password: 'doctor123',
          name: 'Dr. John Smith',
          specialty: 'Cardiology',
          isVerified: true  // This doctor is verified and can log in
        },
        {
          email: 'dr.sarah@example.com',
          password: 'doctor123',
          name: 'Dr. Sarah Johnson',
          specialty: 'Pediatrics',
          isVerified: true  // This doctor is verified and can log in
        },
        {
          email: 'dr.ahmed@example.com',
          password: 'doctor123',
          name: 'Dr. Ahmed Khan',
          specialty: 'Dermatology',
          isVerified: false  // This doctor is NOT verified - should redirect to pending
        },
        {
          email: 'dr.fatima@example.com',
          password: 'doctor123',
          name: 'Dr. Fatima Ali',
          specialty: 'Neurology',
          isVerified: true  // This doctor is verified and can log in
        }
      ];

      try {
        // Check if it's an admin login attempt
        if (email.toLowerCase() === 'admin@example.com') {
          response = await api.post('/auth/admin/login', { email, password });
          isAdmin = true;
        } else {
          // Check if it's a dummy doctor login
          const dummyDoctor = dummyDoctors.find(doc =>
            doc.email.toLowerCase() === email.toLowerCase() && doc.password === password
          );

          if (dummyDoctor) {
            console.log('Found dummy doctor:', dummyDoctor.email, 'isVerified:', dummyDoctor.isVerified);

            // Check if doctor is verified
            if (!dummyDoctor.isVerified) {
              console.log('Doctor not verified, redirecting to verification pending');
              // Doctor exists but not verified - redirect to pending verification
              const pendingUser = {
                id: 'doc-pending-' + Date.now(),
                name: dummyDoctor.name,
                email: dummyDoctor.email,
                role: 'doctor',
                specialty: dummyDoctor.specialty,
                createdAt: new Date().toISOString(),
                status: 'pending',
                isVerified: false
              };

              localStorage.setItem('pendingUser', JSON.stringify(pendingUser));
              navigate('/verification-pending');
              throw new Error('Your account is pending verification. Please wait for admin approval.');
            }

            console.log('Doctor is verified, allowing login');
            // Clear any pending user data since doctor is now logging in successfully
            localStorage.removeItem('pendingUser');
            
            // Doctor is verified - allow login
            response = {
              data: {
                token: 'dummy-doctor-token-' + Date.now(),
                user: {
                  id: 'doc-' + Date.now(),
                  name: dummyDoctor.name,
                  email: dummyDoctor.email,
                  role: 'doctor',
                  specialty: dummyDoctor.specialty,
                  isVerified: true
                }
              }
            };
          } else {
            // TODO: For real database integration, replace above dummy logic with:
            /*
            try {
              const doctorResponse = await api.post('/auth/doctor/login', { email, password });
              const doctor = doctorResponse.data.user;
              
              // Check if doctor is verified
              if (!doctor.isVerified) {
                const pendingUser = {
                  id: doctor.id,
                  name: doctor.name,
                  email: doctor.email,
                  role: 'doctor',
                  specialty: doctor.specialty,
                  createdAt: doctor.createdAt,
                  status: 'pending',
                  isVerified: false
                };
                
                localStorage.setItem('pendingUser', JSON.stringify(pendingUser));
                navigate('/verification-pending');
                throw new Error('Your account is pending verification. Please wait for admin approval.');
              }
              
              // Doctor is verified - use the response
              response = doctorResponse;
            } catch (doctorLoginError) {
              // If doctor login fails, try regular patient login
              response = await api.post('/auth/login', { email, password });
            }
            */
            // Regular user login (patients)
            response = await api.post('/auth/login', { email, password });
          }
        }
      } catch (userLoginError) {
        // Check if this is a pending verification error
        if (userLoginError.pendingVerification) {
          isPendingVerification = true;
          response = { data: userLoginError };
        } else {
          // If regular login fails, try admin login
          try {
            response = await api.post('/auth/admin/login', { email, password });
            isAdmin = true;
          } catch (adminLoginError) {
            // Both failed, throw the original user login error
            throw userLoginError;
          }
        }
      }

      if (isPendingVerification) {
        // Store the pending verification user data
        localStorage.setItem('pendingUser', JSON.stringify(response.data.user));
        // Don't set a token for pending users
        navigate('/verification-pending');
        return response.data;
      }

      // Store token
      localStorage.setItem('token', response.data.token);

      if (isAdmin) {
        // Admin login - create user object from token payload
        const adminUser = {
          email: email,
          role: 'admin',
          isVerified: true
        };
        localStorage.setItem('user', JSON.stringify(adminUser));
        setCurrentUser(adminUser);
        navigate('/admin/dashboard');
      } else {
        // Regular user login
        console.log('Setting user data:', response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setCurrentUser(response.data.user);

        // Check for redirect URL after login
        const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
        if (redirectAfterLogin) {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectAfterLogin);
        } else {
          // Redirect based on user role
          if (response.data.user && response.data.user.role === 'doctor') {
            console.log('Redirecting doctor to dashboard');
            navigate('/doctor/dashboard');
          } else {
            console.log('Redirecting patient to dashboard');
            navigate('/patient/dashboard');
          }
        }
      }

      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function for patients
  const signUpPatient = async (name, email, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/patient/register', {
        name,
        email,
        password
      });

      // Instead of storing token and user data, redirect to sign-in
      // Clear any existing auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);

      // Navigate to sign-in page
      navigate('/sign-in', {
        state: {
          registrationSuccess: true,
          email: email
        }
      });

      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('pendingUser'); // Clear any pending user data
    setCurrentUser(null);
    navigate('/sign-in');
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      throw err;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);

      // Update local user data if needed
      if (response.data.success && currentUser) {
        const updatedUser = {
          ...currentUser,
          name: profileData.name || currentUser.name
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }

      return response.data;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    signIn,
    signUpPatient,
    signOut,
    getUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;