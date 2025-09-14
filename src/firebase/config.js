// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace these values with your actual Firebase config
const firebaseConfig = {
 apiKey: "AIzaSyAxTGDImIQwCNRqxlPw2eFakojNyZdq2QI",
  authDomain: "upi-app-7e91a.firebaseapp.com",
  projectId: "upi-app-7e91a",
  storageBucket: "upi-app-7e91a.firebasestorage.app",
  messagingSenderId: "607149826417",
  appId: "1:607149826417:web:68cc1f7fdbd129cf3496d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;