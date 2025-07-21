import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

// This is a helper component that contains the core logic
const InitialLayout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // This is the most important rule: DO NOTHING until the auth state is confirmed.
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // If we are done loading and there is NO user, and we are NOT in the auth section,
    // then it's safe to redirect to the login page.
    if (!user && !inAuthGroup) {
      router.replace('/login');
    } 
    // If we are done loading and there IS a user, but we are stuck on a login/signup screen,
    // then it's safe to redirect to the main app.
    else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, isLoading, segments, router]); // This effect re-runs when isLoading or user changes.

  // While the initial authentication check is happening, show a loading spinner.
  // This prevents the app from showing anything until it knows if the user is logged in.
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // Once loading is complete, render the appropriate navigator.
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

// This is the main RootLayout component that wraps everything
export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <InitialLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}
