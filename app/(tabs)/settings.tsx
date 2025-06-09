import React from 'react';
import { View, Text, Button, StyleSheet, Switch } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebaseConfig';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColor } from '../../hooks/useThemeColor'; // 👈 We will now use this everywhere

export default function SettingsScreen() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // 👇 Use the hook to get colors that change with the theme
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'border');

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.headerContainer, { backgroundColor: cardColor, borderBottomColor: borderColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Settings</Text>
      </View>
      
      <View style={[styles.section, { backgroundColor: cardColor, borderColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>
        <View style={[styles.row, { borderTopColor: borderColor }]}>
          <Text style={[styles.label, { color: textColor }]}>Email</Text>
          <Text style={[styles.value, { color: secondaryTextColor }]}>{user ? user.email : 'Not logged in'}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Log Out" color="#ff3b30" onPress={handleLogout} />
        </View>
      </View>
      
      <View style={[styles.section, { backgroundColor: cardColor, borderColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>
        <View style={[styles.row, { borderTopColor: borderColor }]}>
          <Text style={[styles.label, { color: textColor }]}>Dark Mode</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={theme === 'dark' ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleTheme}
            value={theme === 'dark'}
          />
        </View>
      </View>
    </View>
  );
}

// 👇 Note how we remove hardcoded colors from the StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  label: {
    fontSize: 17,
  },
  value: {
    fontSize: 17,
  },
  buttonContainer: {
      padding: 8,
  }
});