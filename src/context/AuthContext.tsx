import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, logout as logoutApi, initializeMockData } from '@/services/mockApi';

interface User {
  id?: string;
  name?: string;
  rollNumber?: string;
  username?: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
    
    // Check for existing session
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
