import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuthState(JSON.parse(storedAuth));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // For prototype, we'll use a hardcoded default user
    if (username === 'FirstDev' && password === 'A123456789+') {
      const user: User = {
        username: 'FirstDev',
        firstName: 'Nombre',
        lastName: 'Apellido',
        nickname: 'DevUser',
        email: 'Example@mail.com',
        dateOfBirth: '1980-01-01',
        userLevel: 6,
        enabled: true,
        position: 'Developer',
        assignedBranches: [{
          company: 'MMM',
          worldRegion: 'Europe Block C',
          regionSector: 'Presbitery 1',
          country: 'Luxembourg',
          zone: 'Luxembourg',
          province: 'Luxembourg',
          city: 'Luxembourg',
          name: 'Lux Central',
          approver: 'FirstDev'
        }]
      };

      const newAuthState = {
        user,
        isAuthenticated: true,
        token: 'dummy-jwt-token',
      };

      localStorage.setItem('auth', JSON.stringify(newAuthState));
      setAuthState(newAuthState);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}