import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="px-6 py-4 shadow-sm bg-white flex justify-between items-center relative z-50 rounded">
      <h1
        onClick={() => navigate('/')}
        className="text-xl font-bold cursor-pointer"
      >
        WEBAPP HOTÉIS MERN
      </h1>

      {user ? (
        // user autenticado
        <div className="flex items-center gap-4">
          {user.role === 'hospede' ? (
            <Link
              to="/guest"
              className="bg-blue-600 text-white py-1.5 px-4 rounded-md hover:bg-blue-700"
            >
              Área pessoal
            </Link>
          ) : (
            <Link
              to="/hotel"
              className="bg-blue-600 text-white py-1.5 px-4 rounded-md hover:bg-blue-700"
            >
              Área&nbsp;do&nbsp;hotel
            </Link>
          )}

          <span className="text-gray-700 hidden sm:inline">{user.name}</span>

          <button
            onClick={logout}
            className="bg-gray-200 text-gray-800 py-1.5 px-4 rounded-md hover:bg-gray-300"
          >
            Sair
          </button>
        </div>
      ) : (
        // nao autenticado
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 text-white py-1.5 px-4 rounded-md hover:bg-indigo-700"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-gray-200 text-gray-800 py-1.5 px-4 rounded-md hover:bg-gray-300"
          >
            Registar
          </button>
        </div>
      )}
    </header>
  );
}
