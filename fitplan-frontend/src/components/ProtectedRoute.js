import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, setupCompleted, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!setupCompleted) {
    return <Navigate to="/profile-setup" />;
  }

  return children;
};

export default ProtectedRoute; 