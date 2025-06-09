import React, { useState, useEffect } from 'react';
// 👇 Alert is now added to this import from react-native
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Pressable, Image, Alert } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useIsFocused } from '@react-navigation/native';
import { NativeModules } from 'react-native';
// 👇 Ionicons is now imported from @expo/vector-icons
import { Ionicons } from '@expo/vector-icons';

const { UsageStatsModule } = NativeModules;

// The data from our native module now includes the icon
interface AppUsage {
  appName: string;
  totalTime: number; // in milliseconds
  icon: string; // Base64 encoded PNG string
}

// A component for our new secondary tabs
const SecondaryTab = ({ label, isActive, onPress }: { label: string, isActive: boolean, onPress: () => void }) => {
    const accentColor = useThemeColor({}, 'tint');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');

    return (
        <Pressable onPress={onPress} style={[styles.tab, isActive && { borderBottomColor: accentColor }]}>
            <Text style={[styles.tabText, { color: isActive ? accentColor : secondaryTextColor }]}>{label}</Text>
        </Pressable>
    );
};


export default function StatsScreen() {
    const [hasPermission, setHasPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
    const [timeRange, setTimeRange] = useState<'today' | 'weekly' | 'monthly'>('today');
    const isFocused = useIsFocused();

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const accentColor = useThemeColor({}, 'tint');
    const buttonTextColor = useThemeColor({}, 'headerText');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');

    const checkPermission = async () => {
        const isGranted = await UsageStatsModule.checkPermission();
        setHasPermission(isGranted);
        return isGranted;
    };

    const loadUsageData = async (range: 'today' | 'weekly' | 'monthly') => {
        setIsLoading(true);
        try {
            // Pass the selected time range to our native function
            const usageData: AppUsage[] = await UsageStatsModule.getUsageStats(range);
            const sortedUsage = usageData.sort((a, b) => b.totalTime - a.totalTime);
            setAppUsage(sortedUsage);
        } catch (error) {
            console.error("Failed to get usage stats:", error);
            // This Alert call will now work correctly
            Alert.alert("Error", "Could not load usage stats.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            checkPermission().then(isGranted => {
                if (isGranted) {
                    loadUsageData(timeRange);
                } else {
                    setIsLoading(false);
                }
            });
        }
    }, [isFocused, timeRange]);

    const renderUsageItem = ({ item }: { item: AppUsage }) => {
        const hours = Math.floor(item.totalTime / 1000 / 3600);
        const minutes = Math.floor((item.totalTime / 1000 / 60) % 60);
        const timeString = `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;

        return (
            <View style={[styles.itemContainer, { backgroundColor: cardColor }]}>
                {/* Use an Image component to display the Base64 icon */}
                <Image
                    source={{ uri: `data:image/png;base64,${item.icon}` }}
                    style={styles.icon}
                />
                <Text style={[styles.appName, { color: textColor }]}>{item.appName}</Text>
                <Text style={{ color: secondaryTextColor, fontWeight: '500' }}>{timeString}</Text>
            </View>
        );
    };

    if (!hasPermission) {
        return (
             <View style={[styles.permissionContainer, {backgroundColor}]}>
                {/* This Ionicons component will now work correctly */}
                <Ionicons name="stats-chart-outline" size={60} color={accentColor} />
                <Text style={[styles.permissionText, { color: textColor }]}>FocusFlow needs permission to access app usage to show your stats.</Text>
                <Pressable style={[styles.button, {backgroundColor: accentColor}]} onPress={() => UsageStatsModule.requestPermission()}>
                    <Text style={[styles.buttonText, {color: buttonTextColor}]}>Grant Permission</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
             <View style={styles.tabContainer}>
                <SecondaryTab label="Today" isActive={timeRange === 'today'} onPress={() => setTimeRange('today')} />
                <SecondaryTab label="Weekly" isActive={timeRange === 'weekly'} onPress={() => setTimeRange('weekly')} />
                <SecondaryTab label="Monthly" isActive={timeRange === 'monthly'} onPress={() => setTimeRange('monthly')} />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" style={{ marginTop: 50 }} color={accentColor} />
            ) : (
                <FlatList
                    data={appUsage}
                    renderItem={renderUsageItem}
                    keyExtractor={(item) => item.appName}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={<Text style={{textAlign: 'center', color: secondaryTextColor}}>No app usage data found for this period.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
    permissionText: { textAlign: 'center', marginVertical: 20, fontSize: 16, lineHeight: 24 },
    button: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 100, elevation: 2 },
    buttonText: { fontWeight: 'bold', fontSize: 16 },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 60,
        paddingBottom: 0,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    tab: {
        paddingBottom: 12,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2,
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 16,
        borderRadius: 8,
    },
    appName: { flex: 1, fontWeight: '600', fontSize: 16 }
});
