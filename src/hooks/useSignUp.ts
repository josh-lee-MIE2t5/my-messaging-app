import { AuthContext } from "@/context/context";
import { useContext } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import authClient from "@/firebase/firebase";
import { db } from "@/firebase/firebase";
import { addDoc, collection } from "firebase/firestore";

function useSignUp() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  async function signUp(email: string, password: string) {
    const res = await createUserWithEmailAndPassword(
      authClient,
      email,
      password
    );
    if (!res) throw new Error("Sign up failed");
    authContext?.setUser(res.user);
    const dbRef = collection(db, "users");
    const data = { email: res.user.email, uid: res.user.uid };
    await addDoc(dbRef, data);
    router.push("/");
  }
  return signUp;
}

export default useSignUp;
