import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Pressable } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { Link } from 'expo-router';
import { useThemeColor } from '../../hooks/useThemeColor';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Theming Hooks ---
    const { theme } = useTheme();
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const accentColor = useThemeColor({}, 'tint');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error: any) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* This ensures the status bar icons (time, battery) are visible */}
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            
            <Text style={[styles.title, { color: textColor }]}>Welcome Back!</Text>
            <TextInput
                style={[styles.input, { backgroundColor: cardColor, color: textColor, borderColor }]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={secondaryTextColor}
            />
            <TextInput
                style={[styles.input, { backgroundColor: cardColor, color: textColor, borderColor }]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={secondaryTextColor}
            />
            <View style={styles.buttonContainer}>
              <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} color={accentColor} />
            </View>
            <View style={styles.linkContainer}>
                <Link href="/signup" asChild>
                    <Pressable>
                      <Text style={[styles.linkText, { color: accentColor }]}>Don't have an account? Sign Up</Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
    input: { height: 50, borderWidth: 1, marginBottom: 12, padding: 15, borderRadius: 10, fontSize: 16 },
    buttonContainer: {
        marginTop: 10,
    },
    linkContainer: { marginTop: 20, alignItems: 'center' },
    linkText: { fontSize: 16, fontWeight: '600' }
});