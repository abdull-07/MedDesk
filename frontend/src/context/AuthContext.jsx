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
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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

      try {
        // First try regular user login
        response = await api.post('/auth/login', { email, password });
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
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setCurrentUser(response.data.user);
        
        // Redirect based on user role
        if (response.data.user && response.data.user.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/dashboard');
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