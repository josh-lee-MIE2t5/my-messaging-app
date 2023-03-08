import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "@/context/context";
import { useContext } from "react";
import authClient from "@/firebase/firebase";
import { useRouter } from "next/router";
function useSignIn() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const signInUserEmail = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(authClient, email, password);
      authContext?.setUser(res.user);
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    //implement a sign in with google then add it to return object
  };
  return { signInUserEmail };
}

export default useSignIn;
