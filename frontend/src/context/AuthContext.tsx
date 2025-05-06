import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

interface IUser {
  id: string;
  name: string;
  role: 'hospede' | 'hotel';
}

interface IAuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token)
      api
        .get('/auth/me')
        .then((res) => setUser(res.data.user))
        .catch(() => logout());
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
