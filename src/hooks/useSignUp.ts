import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import authClient from "@/firebase/firebase";
import { db } from "@/firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useErrorHandler } from "react-error-boundary";
function useSignUp() {
  const handleError = useErrorHandler();
  const authContext = useContext(AuthContext);
  const router = useRouter();
  async function signUp(email: string, password: string) {
    try {
      const res = await createUserWithEmailAndPassword(
        authClient,
        email,
        password
      );
      authContext?.setUser(res.user);
      const dbRef = collection(db, "users");
      const data = { email: res.user.email, uid: res.user.uid };
      await addDoc(dbRef, data);
      router.push("/");
    } catch (error) {
      handleError(error);
    }
  }
  return signUp;
}

export default useSignUp;
