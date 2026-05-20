import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'Manager' | 'Salesman' | 'Sales Assistant';

interface User {
  name: string;
  userId: string;
  role: UserRole;
  firm: string;
  initials: string;
}

interface AuthContextType {
  user: User | null;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
}

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin123',
    user: { name: 'Rajan Thomas', userId: 'admin', role: 'Manager', firm: 'Hi Tech Engineering - Main', initials: 'RT' },
  },
  arun_k: {
    password: 'arun123',
    user: { name: 'Arun Kumar', userId: 'arun_k', role: 'Salesman', firm: 'Hi Tech Engineering - Main', initials: 'AK' },
  },
  priya_m: {
    password: 'priya123',
    user: { name: 'Priya Menon', userId: 'priya_m', role: 'Sales Assistant', firm: 'Hi Tech Electricals', initials: 'PM' },
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userId: string, password: string): boolean => {
    const entry = DEMO_USERS[userId];
    if (entry && entry.password === password) {
      setUser(entry.user);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
