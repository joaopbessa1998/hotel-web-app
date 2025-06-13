import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterModal from '@/components/Auth/RegisterModal';
import { AuthContext } from '@/context/AuthContext';

export function Register() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const dest = user.role === 'hotel' ? '/hotel' : '/guest';
    navigate(dest, { replace: true });
  }, [user, navigate]);

  return <RegisterModal open={true} onOpenChange={() => {}} />;
}
