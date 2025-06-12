import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Switch, Alert, Pressable } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebaseConfig';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { NativeModules } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { UsageStatsModule } = NativeModules;

export default function SettingsScreen() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isFocused = useIsFocused();

  const [isBlockingEnabled, setIsBlockingEnabled] = useState(false);

  // --- Theming hooks ---
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'border');
  const accentColor = useThemeColor({}, 'tint');

  // --- Effects and Handlers ---
  // This effect checks the Accessibility Service permission status every time the user visits this screen
  useEffect(() => {
    const checkStatus = async () => {
        try {
            const isEnabled = await UsageStatsModule.isAccessibilityServiceEnabled();
            setIsBlockingEnabled(isEnabled);
        } catch (e) {
            console.error("Failed to check accessibility status", e)
        }
    };
    if(isFocused){
        checkStatus();
    }
  }, [isFocused]);

  const handleLogout = () => {
    auth.signOut();
  };

  const onBlockingToggle = () => {
    // If the service is already on, tapping the switch should take them to settings to turn it off.
    // If it's off, we prompt them to turn it on.
    const alertTitle = isBlockingEnabled ? "Disable App Blocker" : "Enable App Blocker";
    const alertMessage = isBlockingEnabled
        ? "To disable this feature, you will be taken to your phone's Accessibility settings. Find 'FocusFlow' and turn it off."
        : "This feature requires a special permission. You will be taken to your phone's Accessibility settings. Please find 'FocusFlow' in the list of downloaded apps and enable it.";
    
    Alert.alert(
        alertTitle,
        alertMessage,
        [
            { text: "Cancel", style: "cancel" },
            { text: "Go to Settings", onPress: () => UsageStatsModule.requestAccessibilityPermission() }
        ]
    )
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.headerContainer, { backgroundColor: cardColor, borderBottomColor: borderColor }]}>
        <Text style={[styles.title, { color: textColor }]}>Settings</Text>
      </View>
      
      {/* Account Section */}
      <View style={[styles.section, { borderTopColor: borderColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>
        <View style={[styles.row, { borderTopColor: borderColor, backgroundColor: cardColor }]}>
          <Text style={[styles.label, { color: textColor }]}>Email</Text>
          <Text style={[styles.value, { color: secondaryTextColor }]}>{user ? user.email : 'Not logged in'}</Text>
        </View>
        <View style={[styles.row, { borderTopColor: borderColor, backgroundColor: cardColor }]}>
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Log Out</Text>
            </Pressable>
        </View>
      </View>
      
      {/* Appearance Section */}
      <View style={[styles.section, { borderTopColor: borderColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>
        <View style={[styles.row, { borderTopColor: borderColor, backgroundColor: cardColor }]}>
          <Text style={[styles.label, { color: textColor }]}>Dark Mode</Text>
          <Switch onValueChange={toggleTheme} value={theme === 'dark'} trackColor={{ false: "#767577", true: accentColor }} thumbColor={"#f4f3f4"}/>
        </View>
      </View>

      {/* App Blocker Section */}
      <View style={[styles.section, { borderTopColor: borderColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>App Blocker</Text>
        <View style={[styles.row, { borderTopColor: borderColor, backgroundColor: cardColor }]}>
          <View style={{flex: 1, marginRight: 10}}>
            <Text style={[styles.label, { color: textColor }]}>Enable Real-time Blocking</Text>
            <Text style={[styles.description, { color: secondaryTextColor }]}>Requires Accessibility permission to detect which app is open.</Text>
          </View>
          <Switch onValueChange={onBlockingToggle} value={isBlockingEnabled} trackColor={{ false: "#767577", true: accentColor }} thumbColor={"#f4f3f4"}/>
        </View>
      </View>

      {/* Others Section */}
      <View style={[styles.section, { borderTopColor: borderColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Others</Text>
        <Pressable onPress={() => Alert.alert(
            "About Us", 
            "Welcome to FocusFlow – Your Personal Productivity Companion.\n\nAt FocusFlow, we believe in the power of mindful technology use. Our mission is to help individuals take control of their digital habits, boost their productivity, and achieve a healthier balance between screen time and real life.\n\nWe understand how distracting smartphones can be, and how they often get in the way of goals, focus, and mental well-being. That’s why we built FocusFlow – a smart, user-friendly app that empowers you to stay focused, limit distractions, and cultivate mindful digital habits.\n\nWhat We Offer\n\n🎯 Focus Sessions to help you stay on track\n📊 Daily Insights & Usage Stats to keep you informed\n⏱ App Usage Limits to control screen time\n🔔 Reminders & Motivation to keep you consistent\n🧘 Mindfulness Tools to support mental clarity\n🏆 Goal Setting & Progress Tracking to celebrate achievements\n\n\nWhether you're a student, professional, or anyone striving for better time management, FocusFlow is designed to support you on your journey to a more focused, intentional life."
        )} style={[styles.row, { borderTopColor: borderColor, backgroundColor: cardColor }]}>
            <Ionicons name="information-circle-outline" size={24} color={secondaryTextColor} style={{marginRight: 15}}/>
            <Text style={[styles.label, { color: textColor, flex: 1 }]}>About Us</Text>
            <Ionicons name="chevron-forward-outline" size={22} color={secondaryTextColor} />
        </Pressable>
        <Pressable onPress={() => Alert.alert("Privacy Policy", "Your data is stored securely and is never shared.")} style={[styles.row, { borderTopColor: borderColor, backgroundColor: cardColor }]}>
            <Ionicons name="shield-checkmark-outline" size={24} color={secondaryTextColor} style={{marginRight: 15}}/>
            <Text style={[styles.label, { color: textColor, flex: 1 }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward-outline" size={22} color={secondaryTextColor} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { padding: 16, paddingTop: 60, borderBottomWidth: 1, },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', paddingHorizontal: 16, marginBottom: 8, textTransform: 'uppercase', opacity: 0.6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1 },
  label: { fontSize: 17 },
  value: { fontSize: 17, },
  description: { fontSize: 13, marginTop: 4, },
  logoutButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#ff3b30',
    fontSize: 17,
    fontWeight: '500',
  }
});
