import authClient from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "@/context/context";
import { useContext } from "react";

function useSignOut() {
  const authContext = useContext(AuthContext);
  const signOutUser = async () => {
    try {
      const res = await signOut(authClient);
      console.log(res);
      authContext?.setUser(null);
    } catch (error) {
      console.log(error);
    }
  };
  return signOutUser;
}

export default useSignOut;
