// src/contexts/AuthContext.tsx
import { createContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  phoneNumber: string;
  name: string;
  role: 'doctor' | 'admin';
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (phoneNumber: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Validate phone number (10 digits) and password (min 6 chars)
        if (phoneNumber.length === 10 && password.length >= 6) {
          const mockUser: User = {
            id: '1',
            phoneNumber: phoneNumber,
            name: 'Dr. John Doe',
            role: 'doctor',
            email: `${phoneNumber}@swasthya.com`,
          };
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};