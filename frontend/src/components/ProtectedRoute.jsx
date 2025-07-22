import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ 
  allowedRoles = [], 
  redirectPath = '/sign-in' 
}) => {
  const { currentUser } = useAuth();
  
  // Check if there's a pending doctor verification
  useEffect(() => {
    const pendingUser = localStorage.getItem('pendingUser');
    if (pendingUser) {
      const user = JSON.parse(pendingUser);
      if (user.role === 'doctor' && !user.isVerified) {
        // If we're not already on the verification pending page, redirect there
        if (window.location.pathname !== '/verification-pending') {
          window.location.href = '/verification-pending';
        }
      }
    }
  }, []);
  
  // Check if user is authenticated
  if (!currentUser) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // Check if doctor is verified
  if (currentUser.role === 'doctor' && !currentUser.isVerified) {
    return <Navigate to="/verification-pending" replace />;
  }
  
  // If allowedRoles is provided and not empty, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect based on user role
    if (currentUser.role === 'patient') {
      return <Navigate to="/patient/dashboard" replace />;
    } else if (currentUser.role === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  // If user is authenticated and has required role, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;