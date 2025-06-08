// app/(auth)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  // This Stack navigator will handle the login and signup screens
  // We can set headerShown to false for all screens in this stack
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}