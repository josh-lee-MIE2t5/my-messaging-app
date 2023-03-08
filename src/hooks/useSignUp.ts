import { AuthContext } from "@/context/context";
import { useContext } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import authClient from "@/firebase/firebase";

function useSignUp() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  async function signUp(email: string, password: string) {
    try {
      const res = await createUserWithEmailAndPassword(
        authClient,
        email,
        password
      );
      if (!res) throw new Error("Sign up failed");

      console.log(res);
      authContext?.setUser(res.user);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }
  return signUp;
}

export default useSignUp;
