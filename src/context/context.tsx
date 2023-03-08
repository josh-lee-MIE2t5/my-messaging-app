import { createContext } from "react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import authClient from "@/firebase/firebase";
import ReactFCProps from "@/types/ReactFCProps.types";
export interface UserContext {
  user: User | null;
  setUser: Function;
}

export const AuthContext = createContext<UserContext | undefined>(undefined);

export function AuthProvider({ children }: ReactFCProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    authClient.onAuthStateChanged(setUser);
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
