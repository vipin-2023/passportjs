// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

type IAuthContext = {
  user: any | null;
  login: (user: any) => void;
  logout: () => void;
};
interface IUser {
  createdAt: string;
  email: string;
  name: string;
  updatedAt:string;
  _id:string;
}
const AuthContext = createContext<IAuthContext | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      const parsedUser: Partial<IUser> = JSON.parse(userFromLocalStorage);
      setUser(parsedUser);
    }
  }, []);
  

  const login = (loggedInUser: Partial<IUser>) => {
    const userString = JSON.stringify(loggedInUser);
    localStorage.setItem("user", userString);
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
