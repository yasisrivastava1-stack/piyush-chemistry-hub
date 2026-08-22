import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !userData) {
    return <Navigate to="/login" replace />;
  }

  if (userData.status === 'blocked') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center px-4">
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Account Blocked</h2>
          <p className="text-gray-600">Your account has been deactivated by the administrator.</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    // If not allowed, redirect based on their role
    if (userData.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};
