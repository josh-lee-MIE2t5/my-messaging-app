import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { AuthContext } from "@/context/context";
import { useContext } from "react";
import authClient, { db } from "@/firebase/firebase";
import { useErrorHandler } from "react-error-boundary";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

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
      authContext?.setUser(res.user);
      const q = query(
        collection(db, "users"),
        where("uid", "==", res.user.uid)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.size) {
        const dbRef = collection(db, "users");
        const data = { email: res.user.email, uid: res.user.uid };
        await addDoc(dbRef, data);
      }
    } catch (e) {
      handleError(e);
    }
  };
  return { signInUserEmail, signInWithGoogle };
}

export default useSignIn;
