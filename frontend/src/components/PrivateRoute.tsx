import React, { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface IProps {
  children: ReactNode;
  roles?: ('hospede' | 'hotel')[];
}

const PrivateRoute: React.FC<IProps> = ({ children, roles }) => {
  const { user } = useContext(AuthContext);

  // não autenticado - redireciona para login
  if (!user) return <Navigate to="/login" replace />;

  // autenticado mas sem role permitida - redirectiona para home
  if (roles && roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

export default PrivateRoute;
