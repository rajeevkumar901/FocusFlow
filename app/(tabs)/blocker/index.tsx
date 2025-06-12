import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { NativeModules } from 'react-native';

const { UsageStatsModule } = NativeModules;

// Type for the data we get from our native module
interface InstalledApp {
  name: string;
  packageName: string;
}

// Type for the data we get from Firestore
interface AppLimit {
  limitInMinutes: number;
}

const getIconForApp = (appName: string): keyof typeof Ionicons.glyphMap => {
    const lowerCaseName = appName.toLowerCase();
    if (lowerCaseName.includes('youtube')) return 'logo-youtube';
    if (lowerCaseName.includes('instagram')) return 'logo-instagram';
    if (lowerCaseName.includes('whatsapp')) return 'logo-whatsapp';
    if (lowerCaseName.includes('chrome')) return 'logo-chrome';
    if (lowerCaseName.includes('adobe')) return 'document-text-outline';
    return 'apps-outline';
};

export default function AppLimitListScreen() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
    const [appLimits, setAppLimits] = useState<Record<string, AppLimit>>({});

    // --- Theming hooks ---
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');
    const accentColor = useThemeColor({}, 'tint');

    // This effect loads the list of installed apps from the native module once
    useEffect(() => {
        const loadInstalledApps = async () => {
            setIsLoading(true);
            try {
                const apps: InstalledApp[] = await UsageStatsModule.getInstalledApps();
                // Sort the apps alphabetically for a clean list
                apps.sort((a, b) => a.name.localeCompare(b.name));
                setInstalledApps(apps);
            } catch (e) {
                console.error("Failed to load installed apps", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadInstalledApps();
    }, []); // Empty dependency array ensures this runs only once.

    // This effect listens for real-time updates to the limits saved in Firestore
    useEffect(() => {
        if (!user) return; // Don't listen if the user is not logged in

        const limitsRef = collection(db, "users", user.uid, "appLimits");
        const q = query(limitsRef);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const limits: Record<string, AppLimit> = {};
            snapshot.forEach(doc => {
                // The document ID is the packageName
                limits[doc.id] = doc.data() as AppLimit;
            });
            setAppLimits(limits);
        });

        // Cleanup the listener when the component unmounts or the user changes
        return () => unsubscribe();
    }, [user]);

    // THIS IS THE NEW EFFECT: It sends the updated limits to the native service
    useEffect(() => {
        if (Object.keys(appLimits).length > 0) {
            console.log("Updating native module with new limits:", appLimits);
            UsageStatsModule.updateBlockedAppsList(appLimits);
        }
    }, [appLimits]); // This runs every time the appLimits state is updated


    const renderItem = ({ item }: { item: InstalledApp }) => {
        const limitInfo = appLimits[item.packageName];
        const limitText = limitInfo ? `${Math.floor(limitInfo.limitInMinutes / 60)}h ${limitInfo.limitInMinutes % 60}m / day` : 'No limit set';

        return (
            <Link href={{ pathname: "/blocker/set-limit", params: { packageName: item.packageName, name: item.name, icon: getIconForApp(item.name), limit: limitInfo?.limitInMinutes || 0 } }} asChild>
                <Pressable style={({ pressed }) => [styles.itemContainer, { backgroundColor: cardColor, opacity: pressed ? 0.8 : 1 }]}>
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

    if (isLoading) {
        return <View style={[styles.container, {justifyContent: 'center', backgroundColor}]}><ActivityIndicator size="large" color={accentColor}/></View>
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>App Time Limits</Text>
                <Text style={[styles.description, { color: secondaryTextColor }]}>Select an app to set or modify its daily usage limit.</Text>
            </View>
            <FlatList
                data={installedApps}
                renderItem={renderItem}
                keyExtractor={(item) => item.packageName}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: { paddingTop: 10, paddingBottom: 20, paddingHorizontal: 16 },
    title: { fontSize: 28, fontWeight: 'bold' },
    description: { fontSize: 16, marginTop: 4 },
    itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12 },
    icon: { marginRight: 16 },
    appInfo: { flex: 1 },
    appName: { fontSize: 17, fontWeight: '600' },
    limitText: { fontSize: 14, marginTop: 2 },
});
