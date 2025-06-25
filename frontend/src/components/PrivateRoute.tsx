import { ReactNode, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

interface Props {
  children: ReactNode;
  roles?: ('hospede' | 'hotel')[];
}

const PrivateRoute = ({ children, roles }: Props) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <p className="p-6">A verificar sessão…</p>;

  if (!user)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default PrivateRoute;
