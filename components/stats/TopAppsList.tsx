// components/stats/TopAppsList.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AppInfo } from '../../data/mockUsageData'; // Import the type

type TopAppsListProps = {
    apps: AppInfo[];
};

const TopAppsList = ({ apps }: TopAppsListProps) => {
    const renderItem = ({ item }: { item: AppInfo }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.appName}>{item.name}</Text>
            <Text style={styles.usageText}>{item.usage}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Top Apps by Screen Time</Text>
            <FlatList
                data={apps}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false} // Disable scroll if it's inside a ScrollView
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
        paddingHorizontal: 10,
        elevation: 2,
    },
    icon: {
        fontSize: 20,
        marginRight: 15,
    },
    appName: {
        fontSize: 16,
        flex: 1,
        fontWeight: '500',
    },
    usageText: {
        fontSize: 14,
        color: '#666',
    },
});

export default TopAppsList;