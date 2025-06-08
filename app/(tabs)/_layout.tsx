// app/(tabs)/_layout.tsx (Updated)
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#6200ee' }}>
      <Tabs.Screen name="index" options={{ title: 'Focus', tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats', tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="goals" options={{ title: 'Goals', tabBarIcon: ({ color, size }) => <Ionicons name="flag-outline" size={size} color={color} /> }} />

      {/* ADD THIS TAB BACK */}
      <Tabs.Screen name="blocker" options={{ title: 'App Limits', tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark-outline" size={size} color={color} /> }}/>

      <Tabs.Screen name="reminders" options={{ title: 'Reminders', tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="mindfulness" options={{ title: 'Mindful', tabBarIcon: ({ color, size }) => <Ionicons name="leaf-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} /> }}/>
    </Tabs>
  );
}