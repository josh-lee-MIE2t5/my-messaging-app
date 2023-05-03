import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import authClient from "@/firebase/firebase";
import { db } from "@/firebase/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { AlertContext } from "@/context/AlertContext";
function useSignUp() {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const router = useRouter();
  async function signUp(email: string, password: string, username: string) {
    try {
      const queryForUserName = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const withSameUserNameSnapshot = await getDocs(queryForUserName);
      if (withSameUserNameSnapshot.size === 0) {
        const res = await createUserWithEmailAndPassword(
          authClient,
          email,
          password
        );
        authContext?.setUser(res.user);
        const dbRef = collection(db, "users");
        const data = {
          email: res.user.email,
          uid: res.user.uid,
          username: username,
        };
        await addDoc(dbRef, data);
        router.push("/");
      } else {
        throw new Error(
          `Username ${username} already in use please choose another one`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        alertContext?.setType("error");
        alertContext?.setError(error);
        alertContext?.setMsg(error.message);
      }
    }
  }
  return signUp;
}

export default useSignUp;
