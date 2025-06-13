import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginModal from '@/components/Auth/LoginModal';
import { AuthContext } from '@/context/AuthContext';

export function Login() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // assim que o user chegar, redireciona
  useEffect(() => {
    if (!user) return;
    const from =
      (location.state as any)?.from ||
      (user.role === 'hotel' ? '/hotel' : '/guest');
    navigate(from, { replace: true });
  }, [user, location, navigate]);

  // mantemos sempre o modal aberto
  return <LoginModal open={true} onOpenChange={() => {}} />;
}
