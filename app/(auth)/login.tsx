// app/(auth)/login.tsx (Compat Version)
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../../firebaseConfig'; // We import the compat auth object
import { Link } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            // Use the compat syntax: auth.signInWith...
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error: any) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
            <View style={styles.linkContainer}>
                <Link href="/signup"><Text style={styles.linkText}>Don't have an account? Sign Up</Text></Link>
            </View>
        </View>
    );
}
// Styles
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5 },
    linkContainer: { marginTop: 15, alignItems: 'center' },
    linkText: { color: 'blue' }
});