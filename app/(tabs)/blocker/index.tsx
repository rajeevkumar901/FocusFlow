// app/(tabs)/blocker/index.tsx (Final Simple List Layout)
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { AppInfo, mockTopApps } from '../../../data/mockUsageData';
import { useThemeColor } from '../../../hooks/useThemeColor';

const getIconForApp = (appName: string): keyof typeof Ionicons.glyphMap => {
    if (appName.includes('YouTube')) return 'logo-youtube';
    if (appName.includes('Instagram')) return 'logo-instagram';
    if (appName.includes('WhatsApp')) return 'logo-whatsapp';
    if (appName.includes('Chrome')) return 'logo-chrome';
    return 'apps-outline';
};

export default function AppLimitListScreen() {
    const { theme } = useTheme();
    const textColor = useThemeColor({}, 'text');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');
    const accentColor = useThemeColor({}, 'tint');
    const borderColor = useThemeColor({}, 'border');
    
    const [appLimits] = React.useState({ '1': 105, '2': 70, '3': 45, '4': 0, '5': 0 });

    const renderItem = ({ item }: { item: AppInfo }) => {
        const limit = appLimits[item.id as keyof typeof appLimits];
        const limitText = limit ? `${Math.floor(limit / 60)}h ${limit % 60}m / day` : 'No limit set';

        return (
            <Link href={{ pathname: "/blocker/set-limit", params: { id: item.id, name: item.name, icon: getIconForApp(item.name), limit: limit } }} asChild>
                <Pressable style={({ pressed }) => [styles.itemContainer, { opacity: pressed ? 0.7 : 1 }]}>
                    <Ionicons name={getIconForApp(item.name)} size={32} color={accentColor} style={styles.icon} />
                    <View style={styles.appInfo}>
                        <Text style={[styles.appName, { color: textColor }]}>{item.name}</Text>
                        <Text style={[styles.limitText, { color: secondaryTextColor }]}>{limitText}</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={22} color={secondaryTextColor} />
                </Pressable>
            </Link>
        );
    };

    // A simple component for our separator line
    const ItemSeparator = () => <View style={[styles.separator, { backgroundColor: borderColor }]} />;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: useThemeColor({}, 'background') }]}>
            <LinearGradient
                colors={theme === 'light' ? ['#f2f2f7', '#ffffff'] : ['#000000', '#1c1c1e']}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: textColor }]}>App Time Limits</Text>
                    <Text style={[styles.description, { color: secondaryTextColor }]}>Set daily usage limits for specific applications.</Text>
                </View>
                <FlatList
                    data={mockTopApps}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    // 👇 We add the ItemSeparatorComponent for the horizontal line
                    ItemSeparatorComponent={ItemSeparator}
                    // We remove numColumns to go back to a vertical list
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    header: {
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        marginTop: 4,
    },
    // The styles for each item are a full-width row again
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
    },
    separator: {
        height: 1,
        width: '100%',
        marginLeft: 64, // Indent the separator to align with the text
    },
    icon: {
        marginRight: 16,
    },
    appInfo: {
        flex: 1,
    },
    appName: {
        fontSize: 17,
        fontWeight: '600',
    },
    limitText: {
        fontSize: 14,
        marginTop: 2,
    },
});