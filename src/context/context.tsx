import { createContext } from "react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import authClient from "@/firebase/firebase";
import ReactFCProps from "@/types/ReactFCProps.types";
import nookies from "nookies";

export interface UserContext {
  user: User | null;
  setUser: Function;
}

export const AuthContext = createContext<UserContext | undefined>(undefined);

export function AuthProvider({ children }: ReactFCProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    authClient.onAuthStateChanged(setUser);
    authClient.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, "token", "", { path: "/" });
        //look into setting email, friends, uid, and other attributes of the user into cookies
      } else {
        const token = await user.getIdToken();
        setUser(user);
        nookies.set(undefined, "token", token, { path: "/" });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
