import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "@/context/context";
import { useContext } from "react";
import authClient from "@/firebase/firebase";
import { FirebaseError } from "firebase/app";
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
    //implement a sign in with google then add it to return object
  };
  return { signInUserEmail };
}

export default useSignIn;
