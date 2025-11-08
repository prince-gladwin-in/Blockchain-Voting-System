import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, requireVerified = false }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireVerified && (!user?.isVerified || !user?.isBlockchainVerified)) {
    // Redirect to profile to complete verification
    return <Navigate to="/profile" state={{ message: 'Please complete your verification to access this feature.' }} replace />;
  }

  return children;
};

export default ProtectedRoute;
