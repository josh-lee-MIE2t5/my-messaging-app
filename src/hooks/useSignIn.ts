import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { AuthContext } from "@/context/context";
import { useContext } from "react";
import authClient from "@/firebase/firebase";
import { useErrorHandler } from "react-error-boundary";

function useSignIn() {
  const authContext = useContext(AuthContext);
  const handleError = useErrorHandler();
  const signInUserEmail = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(authClient, email, password);
      authContext?.setUser(res.user);
    } catch (error) {
      handleError(error);
    }
  };
  const signInWithGoogle = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(authClient, googleAuthProvider);
      const credential = GoogleAuthProvider.credentialFromResult(res);
      const token = credential?.accessToken;
      console.log("token: ", token);
      authContext?.setUser(res.user);
    } catch (e) {
      handleError(e);
    }
  };
  return { signInUserEmail, signInWithGoogle };
}

export default useSignIn;
