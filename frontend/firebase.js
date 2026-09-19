// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "koda-843ab.firebaseapp.com",
  projectId: "koda-843ab",
  storageBucket: "koda-843ab.firebasestorage.app",
  messagingSenderId: "108137204444",
  appId: "1:108137204444:web:2bb2d09b346ac5d2fc4219"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider()