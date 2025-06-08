// app/_layout.tsx (Complete and Corrected Version)
import { Ionicons } from '@expo/vector-icons'; // Make sure this import is here
import { Tabs } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6200ee',
      }}
    >
      {/* 1. Focus Screen Icon */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Focus',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      
      {/* 2. Stats Screen Icon */}
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      
      {/* 3. Blocker Screen Icon */}
      <Tabs.Screen
        name="blocker"
        options={{
          title: 'App Limits',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark-outline" size={size} color={color} />
          ),
        }}
      />
      
      {/* 4. Goals Screen Icon */}
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 5. Reminders Screen Icon (This one was likely working) */}
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 6. Mindfulness Screen Icon (This one was likely working) */}
      <Tabs.Screen
        name="mindfulness"
        options={{
          title: 'Mindful',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}