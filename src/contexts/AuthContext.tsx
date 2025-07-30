"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('fatima-bot-user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            ...parsedUser,
            createdAt: new Date(parsedUser.createdAt)
          });
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem('fatima-bot-user');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const storedUsers = localStorage.getItem('fatima-bot-users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      const userObject: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: new Date(user.createdAt)
      };

      setUser(userObject);
      localStorage.setItem('fatima-bot-user', JSON.stringify(userObject));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const storedUsers = localStorage.getItem('fatima-bot-users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In a real app, this would be hashed
        name,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('fatima-bot-users', JSON.stringify(users));

      const userObject: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: new Date(newUser.createdAt)
      };

      setUser(userObject);
      localStorage.setItem('fatima-bot-user', JSON.stringify(userObject));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fatima-bot-user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 