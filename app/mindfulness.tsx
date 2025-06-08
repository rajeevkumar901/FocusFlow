// app/mindfulness.tsx
import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import BreathingExercise from '../components/mindfulness/BreathingExercise';
import CalmingSounds from '../components/mindfulness/CalmingSounds';
import FocusQuote from '../components/mindfulness/FocusQuote';

export default function MindfulnessScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Mindful Moments</Text>
            </View>
            <View style={styles.contentContainer}>
                <BreathingExercise />
                <FocusQuote />
                <CalmingSounds />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerContainer: {
        padding: 24,
        paddingTop: 50,
        backgroundColor: '#6200ee',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    contentContainer: {
        padding: 16,
    }
});