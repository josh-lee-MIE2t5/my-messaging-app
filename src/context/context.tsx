import { createContext } from "react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import authClient from "@/firebase/firebase";

export interface UserContext {
  user: User | null;
  setUser: Function;
}

export const AuthContext = createContext<UserContext | undefined>(undefined);

interface Props {
  children: string | JSX.Element | JSX.Element[] | undefined;
}

export function AuthProvider({ children }: Props) {
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
