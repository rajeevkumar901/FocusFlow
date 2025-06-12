import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

const InitialLayout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // This logic is now UNCOMMENTED to restore the login flow.
    if (isLoading) return; // Wait until auth state is loaded before navigating

    const inAuthGroup = segments[0] === '(auth)';

    // If the user is not signed in and they are not on a login/signup screen,
    // redirect them to the login page.
    if (!user && !inAuthGroup) {
      router.replace('/login');
    } 
    // If the user IS signed in and they are on a login/signup screen,
    // redirect them to the main app.
    else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, isLoading, segments, router]);

  // While loading the user's status, show a spinner to prevent flickering.
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // Once loaded, render the correct navigator stack.
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <InitialLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}
