import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, NativeModules, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { db } from '../../../firebaseConfig';
import { useThemeColor } from '../../../hooks/useThemeColor';

const { UsageStatsModule } = NativeModules;

// Type for the app data we get from our native module
interface InstalledApp {
  name: string;
  packageName: string;
  icon: string | null;
}

// Type for the limit data we get from Firestore
interface AppLimit {
  limitInMinutes: number;
}

export default function AppLimitListScreen() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);
    const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
    const [appLimits, setAppLimits] = useState<Record<string, AppLimit>>({});

    // --- Theming Hooks ---
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');
    const accentColor = useThemeColor({}, 'tint');
    const borderColor = useThemeColor({}, 'border');

    // This effect loads the list of installed apps from the native module once
    useEffect(() => {
        const loadInstalledApps = async () => {
            setIsLoading(true);
            try {
                const apps: InstalledApp[] = await UsageStatsModule.getInstalledApps();
                apps.sort((a, b) => a.name.localeCompare(b.name));
                setInstalledApps(apps);
            } catch (e) {
                console.error("Failed to load installed apps", e);
                Alert.alert("Error", "Could not load the list of apps from your device.");
            } finally {
                setIsLoading(false);
            }
        };
        loadInstalledApps();
    }, []);

    // This effect listens for real-time updates to the limits saved in Firestore
    useEffect(() => {
        if (!user) return;
        const limitsRef = collection(db, "users", user.uid, "appLimits");
        const unsubscribe = onSnapshot(query(limitsRef), (snapshot) => {
            const limits: Record<string, AppLimit> = {};
            snapshot.forEach(doc => {
                limits[doc.id] = doc.data() as AppLimit;
            });
            setAppLimits(limits);
        });
        return () => unsubscribe();
    }, [user]);

    // This effect sends the updated limits to the native service
    useEffect(() => {
        if (Object.keys(appLimits).length > 0) {
            UsageStatsModule.updateBlockedAppsList(appLimits);
        }
    }, [appLimits]);

    const renderItem = useCallback(({ item }: { item: InstalledApp }) => {
        const limitInfo = appLimits[item.packageName];
        const limitText = limitInfo ? `${Math.floor(limitInfo.limitInMinutes / 60)}h ${limitInfo.limitInMinutes % 60}m / day` : 'No limit set';

        return (
            <Link href={{ pathname: "/blocker/set-limit", params: { packageName: item.packageName, name: item.name, icon: '', limit: limitInfo?.limitInMinutes || 0 } }} asChild>
                <Pressable style={({ pressed }) => [styles.itemContainer, { opacity: pressed ? 0.7 : 1 }]}>
                    {item.icon ? (
                        <Image source={{ uri: `data:image/png;base64,${item.icon}` }} style={styles.icon} />
                    ) : (
                        <View style={[styles.icon, styles.iconFallback, { backgroundColor: borderColor }]}>
                            <Ionicons name="apps-outline" size={24} color={secondaryTextColor} />
                        </View>
                    )}
                    <View style={styles.appInfo}>
                        <Text style={[styles.appName, { color: textColor }]}>{item.name}</Text>
                        <Text style={[styles.limitText, { color: secondaryTextColor }]}>{limitText}</Text>
                    </View>
                    {/* The chevron forward icon has been removed from here */}
                </Pressable>
            </Link>
        );
    }, [appLimits, textColor, secondaryTextColor, accentColor, borderColor]);

    // This is a new component for our scrolling header
    const ListHeader = () => (
        <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>App Time Limits</Text>
            <Text style={[styles.description, { color: secondaryTextColor }]}>Select an app to set or modify its daily usage limit.</Text>
        </View>
    );

    const ItemSeparator = () => <View style={[styles.separator, { backgroundColor: borderColor }]} />;

    if (isLoading) {
        return <View style={[styles.container, { justifyContent: 'center', backgroundColor }]}><ActivityIndicator size="large" color={accentColor} /></View>
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
            <LinearGradient
                colors={theme === 'light' ? ['#f2f2f7', '#ffffff'] : ['#000000', '#1c1c1e']}
                style={styles.gradient}
            >
                <FlatList
                    data={installedApps}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.packageName}
                    ItemSeparatorComponent={ItemSeparator}
                    ListHeaderComponent={ListHeader}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', color: secondaryTextColor }}>Could not load apps.</Text>}
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
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
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        width: '100%',
        marginLeft: 0,
        marginTop:10,
    },
    icon: {
        width: 50,
        height: 50,
        marginRight: 16,
        marginLeft:16,
        marginTop:10,
        borderRadius: 8
    },
    iconFallback: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    appInfo: {
        flex: 1,
        marginLeft:16,
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
