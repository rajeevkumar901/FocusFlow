// app/(tabs)/blocker/set-limit.tsx (Redesigned)
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export default function SetLimitScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { name, icon, limit } = params;

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const accentColor = useThemeColor({}, 'tint');
    const buttonTextColor = useThemeColor({}, 'headerText');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');
    const borderColor = useThemeColor({}, 'border');

    const initialLimit = typeof limit === 'string' ? parseInt(limit, 10) : 0;
    const [currentLimit, setCurrentLimit] = useState(initialLimit);

    const handleSave = () => {
        console.log(`Saving limit for ${name}: ${currentLimit} minutes`);
        router.back();
    };

    const formatLimitText = (minutes: number) => {
        if (minutes === 0) return 'No Limit';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h > 0 ? `${h}h ` : ''}${m > 0 ? `${m}m` : ''}`.trim();
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={[styles.card, { backgroundColor: cardColor }]}>
                <Ionicons name={icon as any} size={64} color={accentColor} />
                <Text style={[styles.header, { color: textColor }]}>Set limit for {name}</Text>

                <View style={styles.sliderContainer}>
                    <Text style={[styles.limitText, { color: accentColor }]}>
                        {formatLimitText(currentLimit)}
                    </Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={240} // 4 hours
                        step={15}
                        value={currentLimit}
                        onValueChange={setCurrentLimit}
                        minimumTrackTintColor={accentColor}
                        maximumTrackTintColor={borderColor}
                        thumbTintColor={accentColor}
                    />
                    <View style={styles.labelContainer}>
                        <Text style={{color: secondaryTextColor}}>0m</Text>
                        <Text style={{color: secondaryTextColor}}>4h</Text>
                    </View>
                </View>

                <Pressable style={[styles.saveButton, { backgroundColor: accentColor }]} onPress={handleSave}>
                    <Text style={[styles.saveButtonText, { color: buttonTextColor }]}>Save Limit</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 32,
    },
    sliderContainer: {
        width: '100%',
        alignItems: 'stretch',
        marginBottom: 32,
    },
    limitText: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    saveButton: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});