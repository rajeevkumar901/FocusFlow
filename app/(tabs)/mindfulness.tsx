// app/(tabs)/mindfulness.tsx (Themed)
import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import BreathingExercise from '../../components/mindfulness/BreathingExercise';
import CalmingSounds from '../../components/mindfulness/CalmingSounds';
import FocusQuote from '../../components/mindfulness/FocusQuote';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function MindfulnessScreen() {
    const backgroundColor = useThemeColor({}, 'background');
    const accentColor = useThemeColor({}, 'tint');

    return (
        <ScrollView style={[styles.container, { backgroundColor }]}>
            <View style={[styles.headerContainer, { backgroundColor: accentColor }]}>
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
    container: { flex: 1 },
    headerContainer: { padding: 24, paddingTop: 50 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
    contentContainer: { padding: 16 },
});