import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import LoginModal from '@/components/Auth/LoginModal';
import RegisterModal from '@/components/Auth/RegisterModal';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [loginOpen, setLoginOpen] = useState(false);
  const [regOpen, setRegOpen] = useState(false);

  return (
    <header className="px-6 py-4 shadow-sm bg-white flex justify-between">
      <h1 className="text-xl font-bold">Booking Lite</h1>

      {user ? (
        <div className="flex items-center gap-4">
          <span>{user.name}</span>
          <Button variant="secondary" onClick={logout}>
            Sair
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button onClick={() => setLoginOpen(true)}>Entrar</Button>
          <Button variant="secondary" onClick={() => setRegOpen(true)}>
            Registar
          </Button>
        </div>
      )}

      {/* Modais */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <RegisterModal open={regOpen} onOpenChange={setRegOpen} />
    </header>
  );
}
