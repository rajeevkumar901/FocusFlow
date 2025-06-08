// app/blocker/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function BlockerLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'App Blocker' }} />
      <Stack.Screen name="set-limit" options={{ title: 'Set Time Limit', presentation: 'modal' }} />
    </Stack>
  );
}