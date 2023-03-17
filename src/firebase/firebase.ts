// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "my-messaging-app-556dd.firebaseapp.com",
  projectId: "my-messaging-app-556dd",
  storageBucket: "my-messaging-app-556dd.appspot.com",
  messagingSenderId: "1021822328884",
  appId: "1:1021822328884:web:67268ef2c1a8c2d2b86a61",
  measurementId: "G-TL9D4TBRJ6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const authClient = getAuth(app);
//initialize firestore db
export const db = getFirestore(app);
export default authClient;
