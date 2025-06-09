import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../../firebaseConfig'; // The import stays the same
import { Link } from 'expo-router';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            // THE CHANGE IS HERE: We call the function on the auth object
            await auth.createUserWithEmailAndPassword(email, password);
        } catch (error: any) {
            Alert.alert("Sign Up Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title={loading ? "Creating Account..." : "Sign Up"} onPress={handleSignUp} disabled={loading} />
            <View style={styles.linkContainer}>
                <Link href="/login"><Text style={styles.linkText}>Already have an account? Login</Text></Link>
            </View>
        </View>
    );
}
// Styles remain the same
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5 },
    linkContainer: { marginTop: 15, alignItems: 'center' },
    linkText: { color: 'blue' }
});