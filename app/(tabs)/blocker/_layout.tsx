import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useThemeColor } from '../../../hooks/useThemeColor';

export default function BlockerLayout() {
  const iconColor = useThemeColor({}, 'text');
  const headerBackgroundColor = useThemeColor({}, 'card');
  const headerTintColor = useThemeColor({}, 'text');

  return (

    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          title: 'Manage Apps',
          headerStyle: { backgroundColor: headerBackgroundColor },
          headerTintColor: headerTintColor,
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 20, marginRight: 10 }}>
              <Ionicons name="search-outline" size={24} color={iconColor} />
              <Ionicons name="apps-outline" size={24} color={iconColor} />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="set-limit"
        options={{ 
            title: 'Set Time Limit', 
            presentation: 'modal',
            headerStyle: { backgroundColor: headerBackgroundColor },
            headerTintColor: headerTintColor,
        }}
      />
    </Stack>
  );
}