import authClient from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "@/context/context";
import { useContext } from "react";
import { useRouter } from "next/router";
import { useErrorHandler } from "react-error-boundary";

function useSignOut() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const handleError = useErrorHandler();
  const signOutUser = async () => {
    try {
      const res = await signOut(authClient);
      console.log(res);
      authContext?.setUser(null);
      router.push("/");
    } catch (error) {
      handleError(error);
    }
  };
  return signOutUser;
}

export default useSignOut;
