// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';


type AuthContextType = {
  user: any | null;
  login: (user: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

 
  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      localStorage.setItem('user', userFromLocalStorage);
      setUser(userFromLocalStorage);
    }
  }, []);

  const login = (loggedInUser: any) => {
    localStorage.setItem('user', loggedInUser);
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
