import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCja6eU8MCVbsjsINekYDttfn-wYGxm098", // apparently safe to expose
  authDomain: "ranklr-817e2.firebaseapp.com",
  projectId: "ranklr-817e2",
  storageBucket: "ranklr-817e2.firebasestorage.app",
  messagingSenderId: "1016001677452",
  appId: "1:1016001677452:web:038a7c43fdc078269753a9",
  measurementId: "G-ZTX6D0D9H7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
