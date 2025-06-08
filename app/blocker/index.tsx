// app/blocker/index.tsx (Corrected Version)
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'; // Import Pressable
import { Link } from 'expo-router';
import { mockTopApps, AppInfo } from '../../data/mockUsageData';

export default function AppLimitListScreen() {
    // In a real app, this state would come from a database or AsyncStorage
    const [appLimits, setAppLimits] = useState({
        '1': 105, '2': 70, '3': 45, '4': 0, '5': 0,
    });

    const renderItem = ({ item }: { item: AppInfo }) => {
        const limit = appLimits[item.id as keyof typeof appLimits];
        const limitText = limit ? `${limit} min / day` : 'Not Set';

        return (
            // Use Pressable as the child of Link
            <Link href={{ pathname: "./blocker/set-limit", params: { id: item.id, name: item.name, icon: item.icon, limit: limit } }} asChild>
                <Pressable style={({ pressed }) => [styles.itemContainer, { opacity: pressed ? 0.7 : 1 }]}>
                    <Text style={styles.icon}>{item.icon}</Text>
                    <View style={styles.appInfo}>
                        <Text style={styles.appName}>{item.name}</Text>
                        <Text style={styles.limitText}>{limitText}</Text>
                    </View>
                    <Text style={styles.arrow}>›</Text>
                </Pressable>
            </Link>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.subHeader}>Select an app to set or change its daily usage limit.</Text>
            <FlatList
                data={mockTopApps}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 16,
    },
    subHeader: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    icon: {
        fontSize: 24,
        marginRight: 15,
    },
    appInfo: {
        flex: 1,
    },
    appName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    limitText: {
        fontSize: 14,
        color: 'gray',
    },
    arrow: {
        fontSize: 24,
        color: 'gray',
    },
});