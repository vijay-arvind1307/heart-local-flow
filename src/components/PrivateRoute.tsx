import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You can replace this with a proper loading spinner
    return (
      <div className="min-h-screen bg-dark-blue flex items-center justify-center">
        <div className="text-off-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with the current location in state
    return <Navigate to="/get-started" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected route
  return <Outlet />;
};

export default PrivateRoute;
