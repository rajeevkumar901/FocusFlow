// app/blocker/set-limit.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';

export default function SetLimitScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { name, icon, limit } = params;

    // Convert limit to number and provide a fallback
    const initialLimit = typeof limit === 'string' ? parseInt(limit, 10) : 0;
    const [currentLimit, setCurrentLimit] = useState(initialLimit);

    const handleSave = () => {
        // In a real app, you would save this new `currentLimit` value.
        console.log(`Saving limit for ${name}: ${currentLimit} minutes`);
        router.back(); // Go back to the list screen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.header}>Set Daily Limit for {name}</Text>

            <View style={styles.sliderContainer}>
                <Text style={styles.limitText}>
                    {currentLimit > 0 ? `${currentLimit} minutes` : 'No Limit'}
                </Text>
                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={0}
                    maximumValue={240} // 4 hours max limit
                    step={5}
                    value={currentLimit}
                    onValueChange={setCurrentLimit}
                    minimumTrackTintColor="#6200ee"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#6200ee"
                />
            </View>

            <Button title="Save Limit" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    icon: {
        fontSize: 60,
        marginBottom: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
    },
    sliderContainer: {
        width: '90%',
        alignItems: 'center',
        marginBottom: 40,
    },
    limitText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6200ee',
        marginBottom: 20,
    },
});