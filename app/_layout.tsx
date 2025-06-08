// app/_layout.tsx (The Final Gatekeeper)
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Wait for the auth state to finish loading
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // 2. If the user is not signed in and they are NOT in the (auth) group,
    //    redirect them to the login screen.
    if (!user && !inAuthGroup) {
      router.replace('/login');
    }
    // 3. If the user is signed in and they ARE in the (auth) group,
    //    redirect them from the login page to the main app.
    else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, isLoading, segments, router]); // Re-run this effect when user or isLoading changes

  // While loading the user's status, show a spinner.
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // Once loading is complete, render the navigators
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}