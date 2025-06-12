import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';
import Timer from '../../components/Timer';
import { useThemeColor } from '../../hooks/useThemeColor';
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { UsageStatsModule } = NativeModules;

// A new component for our custom time inputs with corrected prop types
const TimeInput = ({ label, value, onIncrease, onDecrease, textColor, cardColor }: {
    label: string;
    value: number;
    onIncrease: () => void;
    onDecrease: () => void;
    textColor: string;
    cardColor: string;
}) => (
    <View style={[styles.timeInputContainer, {backgroundColor: cardColor}]}>
        <Text style={[styles.timeInputLabel, {color: textColor}]}>{label}</Text>
        <View style={styles.timeInputControls}>
            <Pressable onPress={onDecrease}><Ionicons name="remove-circle-outline" size={32} color={textColor} /></Pressable>
            <Text style={[styles.timeInputValue, {color: textColor}]}>{value} min</Text>
            <Pressable onPress={onIncrease}><Ionicons name="add-circle-outline" size={32} color={textColor} /></Pressable>
        </View>
    </View>
);

export default function FocusSessionScreen() {
    // --- State Management ---
    const [focusDuration, setFocusDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [timer, setTimer] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(true);
    const [dndPermission, setDndPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const intervalRef = useRef<number | null>(null);

    // --- Theming ---
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    // 👇 FIX: Added the required second argument to these calls
    const focusCardColor = useThemeColor({ light: '#E0E7FF', dark: '#1E3A8A' }, 'card');
    const breakCardColor = useThemeColor({ light: '#D1FAE5', dark: '#064E3B' }, 'card');

    // --- Effects ---
    // Load saved durations and check DND permission on initial load
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedFocus = await AsyncStorage.getItem('@focus_duration');
                const savedBreak = await AsyncStorage.getItem('@break_duration');
                if (savedFocus) setFocusDuration(parseInt(savedFocus, 10));
                if (savedBreak) setBreakDuration(parseInt(savedBreak, 10));

                const hasDndPerms = await UsageStatsModule.checkDndPermission();
                setDndPermission(hasDndPerms);
            } catch (e) {
                console.error("Failed to load settings", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);
    
    // Reset timer when durations change while not running
    useEffect(() => {
        if (!isRunning) {
            setTimer(isFocusMode ? focusDuration * 60 : breakDuration * 60);
        }
    }, [focusDuration, breakDuration, isFocusMode, isRunning]);

    // Main timer countdown logic
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning]);

    // Effect to handle timer reaching zero
    useEffect(() => {
        if (isRunning && timer < 0) {
            handleTimerEnd();
        }
    }, [timer, isRunning]);


    // --- Functions ---
    const updateDuration = async (type: 'focus' | 'break', amount: number) => {
        const setDuration = type === 'focus' ? setFocusDuration : setBreakDuration;
        const currentDuration = type === 'focus' ? focusDuration : breakDuration;
        const newDuration = Math.max(1, currentDuration + amount);
        setDuration(newDuration);
        await AsyncStorage.setItem(`@${type}_duration`, newDuration.toString());
    };

    const handleStart = async () => {
        if (dndPermission) {
            await UsageStatsModule.setDndMode(true);
            setIsRunning(true);
        } else {
            Alert.alert(
                "Permission Required",
                "To automatically silence notifications during focus sessions, please grant Do Not Disturb access.",
                [
                    { text: "Not Now", onPress: () => setIsRunning(true) }, // Allow starting without DND
                    { text: "Grant Permission", onPress: () => UsageStatsModule.requestDndPermission() }
                ]
            );
        }
    };
    
    const handleStop = async (reset: boolean = false) => {
        setIsRunning(false);
        if (dndPermission) await UsageStatsModule.setDndMode(false);
        if (reset) {
            setTimer(isFocusMode ? focusDuration * 60 : breakDuration * 60);
        }
    };
    
    const handleTimerEnd = () => {
        const message = isFocusMode ? "Focus session complete! Time for a break." : "Break's over! Time to focus.";
        scheduleNotification(message);
        handleStop(false); // Stop timer and DND
        const nextIsFocus = !isFocusMode;
        setIsFocusMode(nextIsFocus);
        setTimer(nextIsFocus ? focusDuration * 60 : breakDuration * 60);
    };

    const scheduleNotification = async (body: string) => {
        await Notifications.scheduleNotificationAsync({
            content: { title: 'FocusFlow', body },
            trigger: null,
        });
    };

    if (isLoading) {
        return <View style={[styles.container, {justifyContent: 'center'}]}><ActivityIndicator size="large" /></View>
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={[styles.card, { backgroundColor: isFocusMode ? focusCardColor : breakCardColor }]}>
                <Text style={[styles.modeText, { color: textColor }]}>
                    {isFocusMode ? 'Focus Session' : 'Take a Break'}
                </Text>
                <Timer time={timer} color={textColor} />
            </View>

            {isRunning ? (
                <View style={styles.controlsContainer}>
                    <Pressable style={styles.mainButton} onPress={() => handleStop(false)}><Text style={styles.mainButtonText}>Pause</Text></Pressable>
                    <Pressable style={styles.secondaryButton} onPress={() => handleStop(true)}><Text style={styles.secondaryButtonText}>End Session</Text></Pressable>
                </View>
            ) : (
                <>
                    <View style={styles.controlsContainer}>
                        <Pressable style={styles.mainButton} onPress={handleStart}><Text style={styles.mainButtonText}>Start Focus</Text></Pressable>
                    </View>
                    <View style={styles.settingsContainer}>
                        <TimeInput label="Focus Time" value={focusDuration} onIncrease={() => updateDuration('focus', 5)} onDecrease={() => updateDuration('focus', -5)} textColor={textColor} cardColor={cardColor}/>
                        <TimeInput label="Break Time" value={breakDuration} onIncrease={() => updateDuration('break', 1)} onDecrease={() => updateDuration('break', -1)} textColor={textColor} cardColor={cardColor}/>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { width: '90%', padding: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 5 },
    modeText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    controlsContainer: { marginTop: 40, width: '90%', alignItems: 'center' },
    mainButton: { backgroundColor: '#333', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30 },
    mainButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    secondaryButton: { marginTop: 15 },
    secondaryButtonText: { fontSize: 16, color: '#333', opacity: 0.8 },
    settingsContainer: { width: '90%', marginTop: 30 },
    timeInputContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 10 },
    timeInputLabel: { fontSize: 18, fontWeight: '500' },
    timeInputControls: { flexDirection: 'row', alignItems: 'center' },
    timeInputValue: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15 },
});
