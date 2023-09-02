import React from 'react';
import {Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { ProtectedProps } from '../types/registrationType';


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

