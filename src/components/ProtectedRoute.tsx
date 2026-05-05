import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useKeyStore } from '../store/keyStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const privateKey = useKeyStore((state) => state.privateKey);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but keys not loaded, redirect to login to restore keys
  if (!privateKey) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}