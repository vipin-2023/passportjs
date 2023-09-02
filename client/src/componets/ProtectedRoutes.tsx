import React, { useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {

      navigate('/login');
    }
  }, [user, navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
