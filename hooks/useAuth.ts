// hooks/useAuth.ts (Updated)
import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import firebase from 'firebase/compat/app'; // For the User type

export function useAuth() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 👈 ADD THIS

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false); // 👈 ADD THIS
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, isLoading }; // 👈 RETURN isLoading
}