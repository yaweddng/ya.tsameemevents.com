import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer' | 'user';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ya_user');
    const token = localStorage.getItem('ya_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('ya_user', JSON.stringify(userData));
    localStorage.setItem('ya_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ya_user');
    localStorage.removeItem('ya_token');
    setUser(null);
  };

  return { user, loading, login, logout, isAuthenticated: !!user };
};
