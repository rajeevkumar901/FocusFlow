import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { Link } from 'expo-router';
import { useThemeColor } from '../../hooks/useThemeColor';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

export default function SignUpScreen() {
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
    const buttonTextColor = useThemeColor({}, 'headerText');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            await auth.createUserWithEmailAndPassword(email, password);
        } catch (error: any) {
            Alert.alert("Sign Up Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            
            <Text style={[styles.title, { color: textColor }]}>Create Account</Text>
            <TextInput
                style={[styles.input, { backgroundColor: cardColor, color: textColor, borderColor }]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
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
            

            <Pressable style={[styles.button, { backgroundColor: loading ? secondaryTextColor : accentColor }]} onPress={handleSignUp} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color={backgroundColor} />
                ) : (
                    <Text style={[styles.buttonText, { color: buttonTextColor }]}>Sign Up</Text>
                )}
            </Pressable>

            <View style={styles.linkContainer}>
                <Link href="/login" asChild>
                    <Pressable>
                      <Text style={[styles.linkText, { color: accentColor }]}>Already have an account? Login</Text>
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
    button: {
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkContainer: { marginTop: 20, alignItems: 'center' },
    linkText: { fontSize: 16, fontWeight: '600' }
});
