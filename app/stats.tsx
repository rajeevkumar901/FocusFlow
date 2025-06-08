// app/stats.tsx
import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import UsageChart from '../components/stats/UsageChart';
import TopAppsList from '../components/stats/TopAppsList';
import { mockDailyUsage, mockTopApps, mockScreenUnlocks } from '../data/mockUsageData';

export default function StatsScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Your Digital Habits</Text>
            </View>

            <UsageChart data={mockDailyUsage} />

            <View style={styles.unlocksContainer}>
                <Text style={styles.unlocksText}>Screen Unlocks Today</Text>
                <Text style={styles.unlocksCount}>{mockScreenUnlocks}</Text>
            </View>
            
            <TopAppsList apps={mockTopApps} />
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
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    unlocksContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 24,
        padding: 16,
        alignItems: 'center',
        elevation: 3,
    },
    unlocksText: {
        fontSize: 18,
        color: '#333',
    },
    unlocksCount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#6200ee',
        marginTop: 8,
    },
});