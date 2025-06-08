// firebaseConfig.ts (Corrected Version)
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 Import AsyncStorage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhnUnmKv4Pc024y1W3iPKw1F2ZEOzOV7g", // PASTE YOUR KEYS HERE
  authDomain: "focusflowapp-79b5f.firebaseapp.com",
  projectId: "focusflowapp-79b5f",
  storageBucket: "focusflowapp-79b5f.firebasestorage.app",
  messagingSenderId: "213281398764",
  appId: "1:213281398764:web:5a8ffcadc66bf7ef32eac9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 👇 This is the corrected auth initialization
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);