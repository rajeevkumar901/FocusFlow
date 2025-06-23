import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import BreathingExercise from '../../components/mindfulness/BreathingExercise';
import CalmingSounds from '../../components/mindfulness/CalmingSounds';
import FocusQuote from '../../components/mindfulness/FocusQuote';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function MindfulnessScreen() {
    // --- Theming Hooks ---
    const backgroundColor = useThemeColor({}, 'background');
    const accentColor = useThemeColor({}, 'tint');
    // We fetch the special text color designed to contrast with the accent color
    const headerTextColor = useThemeColor({}, 'headerText');

    return (
        <ScrollView style={[styles.container, { backgroundColor }]}>
            <View style={[styles.headerContainer, { backgroundColor: accentColor }]}>
                {/* The title now uses the dynamic headerTextColor */}
                <Text style={[styles.title, { color: headerTextColor }]}>Mindful Moments</Text>
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
    },
    headerContainer: {
        padding: 24,
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        // The hardcoded color: '#fff' has been removed from here
    },
    contentContainer: {
        padding: 16,
    }
});
