// firebaseConfig.ts (Final Compat Version)
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhnUnmKv4Pc024y1W3iPKw1F2ZEOzOV7g",
  authDomain: "focusflowapp-79b5f.firebaseapp.com",
  projectId: "focusflowapp-79b5f",
  storageBucket: "focusflowapp-79b5f.firebasestorage.app",
  messagingSenderId: "213281398764",
  appId: "1:213281398764:web:5a8ffcadc66bf7ef32eac9"
};


// Initialize Firebase if it hasn't been initialized already
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export the compat services
export const auth = firebase.auth();
export const db = firebase.firestore();