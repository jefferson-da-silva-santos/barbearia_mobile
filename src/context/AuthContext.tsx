import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../models/types';
import { getDB } from '../database/db';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const stored = await AsyncStorage.getItem('@barberflow:user');
      if (stored) setUser(JSON.parse(stored));
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = useCallback(async (phone: string, password: string) => {
    const db = await getDB();
    const found = await db.getFirstAsync<any>(
      `SELECT * FROM users WHERE phone = ? AND password_hash = ? AND is_active = 1`,
      [phone, password]
    );
    if (!found) throw new Error('Telefone ou senha incorretos');

    const loggedUser: User = {
      id: found.id,
      name: found.name,
      phone: found.phone,
      email: found.email,
      role: found.role,
      avatar: found.avatar,
      createdAt: found.created_at,
      barbershopId: found.barbershop_id,
    };

    await AsyncStorage.setItem('@barberflow:user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem('@barberflow:user');
    setUser(null);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      signOut,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);