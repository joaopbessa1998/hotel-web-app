import { useState, useContext, MouseEvent, FormEvent } from 'react';
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-gray-400"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg w-full max-w-sm mx-4 p-6 shadow-xl"
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <header className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Registar</h2>
        </header>

        <form
          className="space-y-4"
          onSubmit={async (e: FormEvent<HTMLFormElement>) => {
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
          {/* Campo Nome */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500"
            />
          </div>

          {/* Campo Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500"
            />
          </div>

          {/* Campo Password */}
          <div className="space-y-2">
            <label
              htmlFor="pass"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500"
            />
          </div>

          {/* Campo Tipo de Conta */}
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo de conta
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'hospede' | 'hotel')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                         text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500"
            >
              <option value="hospede">Hóspede</option>
              <option value="hotel">Hotel</option>
            </select>
          </div>

          {/* Botão Registar */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Registar
          </button>
        </form>
      </div>
    </div>
  );
}
