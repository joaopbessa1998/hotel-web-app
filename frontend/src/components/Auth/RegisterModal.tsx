import { useState, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/context/AuthContext';
import api from '@/services/api';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export default function RegisterModal({ open, onOpenChange }: Props) {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState<'hospede' | 'hotel'>('hospede');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registar</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await api.post('/auth/register', {
              name,
              email,
              password: pass,
              role,
            });
            await login(email, pass); // login automático
            onOpenChange(false);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pass">Password</Label>
            <Input
              id="pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Tipo de conta</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="hospede">Hóspede</option>
              <option value="hotel">Hotel</option>
            </select>
          </div>

          <Button className="w-full" type="submit">
            Registar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
