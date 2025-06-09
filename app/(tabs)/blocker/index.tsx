// app/(tabs)/blocker/index.tsx (Final Conditional Render Fix)
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Link } from 'expo-router';
import { mockTopApps, AppInfo } from '../../../data/mockUsageData';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getIconForApp = (appName: string): keyof typeof Ionicons.glyphMap => {
    const lowerCaseName = appName.toLowerCase();
    if (lowerCaseName.includes('youtube')) return 'logo-youtube';
    if (lowerCaseName.includes('instagram')) return 'logo-instagram';
    if (lowerCaseName.includes('whatsapp')) return 'logo-whatsapp';
    if (lowerCaseName.includes('chrome')) return 'logo-chrome';
    if (lowerCaseName.includes('adobe')) return 'document-text-outline';
    return 'apps-outline';
};

type AppLimitInfo = {
    limitInMinutes: number;
    timeSet: number;
    isBlocked: boolean;
};

export default function AppLimitListScreen() {
    const [appLimits, setAppLimits] = useState<Record<string, AppLimitInfo>>({});
    const isFocused = useIsFocused();

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');
    const accentColor = useThemeColor({}, 'tint');

    useEffect(() => {
        const loadLimits = async () => {
            const keys = await AsyncStorage.getAllKeys();
            const limitKeys = keys.filter(k => k.startsWith('@app_limit_'));
            const limits: Record<string, AppLimitInfo> = {};
            for (const key of limitKeys) {
                const item = await AsyncStorage.getItem(key);
                if (item) {
                    const id = key.replace('@app_limit_', '');
                    limits[id] = JSON.parse(item);
                }
            }
            setAppLimits(limits);
        };
        if (isFocused) {
            loadLimits();
        }
    }, [isFocused]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newLimits = { ...appLimits };
            let changed = false;
            for (const id in newLimits) {
                const app = newLimits[id];
                if (app && !app.isBlocked && app.limitInMinutes > 0) {
                    const timeElapsed = Date.now() - app.timeSet;
                    const limitInMillis = app.limitInMinutes * 60 * 1000;
                    if (timeElapsed > limitInMillis) {
                        newLimits[id].isBlocked = true;
                        changed = true;
                    }
                }
            }
            if (changed) {
                setAppLimits(newLimits);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [appLimits]);


    // 👇 THIS IS THE REWRITTEN RENDER FUNCTION 👇
    const renderItem = ({ item }: { item: AppInfo }) => {
        const limitInfo = appLimits[item.id];
        const isBlocked = limitInfo?.isBlocked ?? false;
        const limitText = limitInfo ? `${limitInfo.limitInMinutes} min` : 'Not Set';

        // First, we define the content of the row, which is the same in both cases
        const itemContent = (
            <View style={[styles.itemContainer, { backgroundColor: cardColor }, isBlocked && styles.blockedItem]}>
                <Ionicons name={isBlocked ? 'lock-closed' : getIconForApp(item.name)} size={32} color={isBlocked ? secondaryTextColor : accentColor} style={styles.icon} />
                <View style={styles.appInfo}>
                    <Text style={[styles.appName, { color: isBlocked ? secondaryTextColor : textColor }]}>{item.name}</Text>
                    <Text style={[styles.limitText, { color: secondaryTextColor }]}>{limitText}</Text>
                </View>
                {!isBlocked && <Ionicons name="chevron-forward-outline" size={22} color={secondaryTextColor} />}
            </View>
        );

        if (isBlocked) {
            // If the app is blocked, we return a simple Pressable that shows an alert
            return (
                <Pressable onPress={() => Alert.alert("App Blocked", `${item.name} is blocked for today.`)}>
                    {itemContent}
                </Pressable>
            );
        } else {
            // If it's NOT blocked, we return the Link component that allows navigation
            return (
                <Link href={{ pathname: "/blocker/set-limit", params: { id: item.id, name: item.name, icon: getIconForApp(item.name), limit: limitInfo?.limitInMinutes || 0 } }} asChild>
                    <Pressable>
                        {itemContent}
                    </Pressable>
                </Link>
            );
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>App Time Limits</Text>
                <Text style={[styles.description, { color: secondaryTextColor }]}>Set a temporary timer for an app. The app will be blocked in this list when the timer runs out.</Text>
            </View>
            <FlatList data={mockTopApps} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingHorizontal: 16 }}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: { paddingTop: 10, paddingBottom: 20, paddingHorizontal: 16, },
    title: { fontSize: 28, fontWeight: 'bold' },
    description: { fontSize: 16, marginTop: 4, },
    itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, },
    blockedItem: { opacity: 0.6 },
    icon: { marginRight: 16 },
    appInfo: { flex: 1 },
    appName: { fontSize: 17, fontWeight: '600' },
    limitText: { fontSize: 14, marginTop: 2 },
});