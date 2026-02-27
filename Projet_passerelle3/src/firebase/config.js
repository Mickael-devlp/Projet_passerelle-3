import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqMetNae8BJWi-fVqMu2k4qvU0OWzqKlM",
  authDomain: "projetpasserelle3.firebaseapp.com",
  projectId: "projetpasserelle3",
  storageBucket: "projetpasserelle3.firebasestorage.app",
  messagingSenderId: "64350611960",
  appId: "1:64350611960:web:8d6de5ea749cd094774e0d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
