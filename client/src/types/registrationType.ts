import { ReactNode } from "react";

export interface Register {
  name: string;
  email: string;
  password: string;
  confirmPassword:string;
}
export interface Login {
  email: string;
  password: string;
}


export interface AuthContextType{
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};
export interface AuthProviderProps{
  children: ReactNode;
};