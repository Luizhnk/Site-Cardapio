import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDUjMJ8whvmsTNRy_d3cN0-a3WJNRIrYWg",
  authDomain: "bassa-app-f2164.firebaseapp.com",
  projectId: "bassa-app-f2164",
  storageBucket: "bassa-app-f2164.firebasestorage.app",
  messagingSenderId: "781294565148",
  appId: "1:781294565148:web:a82a98e13cca3a2c98acd9"
};

let app;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase init warning:', error);
}

export { app, auth, db };
