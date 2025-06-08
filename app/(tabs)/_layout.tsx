// app/(tabs)/_layout.tsx (Simplified)
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// This component should NOT have any auth logic in it.
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#6200ee' }}>
      <Tabs.Screen name="index" options={{ title: 'Focus', tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats', tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="goals" options={{ title: 'Goals', tabBarIcon: ({ color, size }) => <Ionicons name="flag-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="reminders" options={{ title: 'Reminders', tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="mindfulness" options={{ title: 'Mindful', tabBarIcon: ({ color, size }) => <Ionicons name="leaf-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}