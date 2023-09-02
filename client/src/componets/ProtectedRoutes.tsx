import React, { ReactNode } from 'react';
import {Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

interface ProtectedProps {
  children: ReactNode;
}

export const Protected: React.FC<ProtectedProps> = ({  children }) => {
  const {user}=useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const Authrized: React.FC<ProtectedProps> = ({  children }) => {
  const {user}=useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

