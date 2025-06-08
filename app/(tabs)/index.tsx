// app/(tabs)/index.tsx (Final Corrected Version)
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Timer from '../../components/Timer';
import TimerControls from '../../components/TimerControls';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function FocusSessionScreen() {
    const FOCUS_TIME_SECONDS = 25 * 60;
    const BREAK_TIME_SECONDS = 5 * 60;

    const [timer, setTimer] = useState(FOCUS_TIME_SECONDS);
    const [isRunning, setIsRunning] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(true);
    const intervalRef = useRef<number | null>(null);

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const focusCardColor = useThemeColor({ light: '#E0E7FF', dark: '#1E3A8A' }, 'card');
    const breakCardColor = useThemeColor({ light: '#D1FAE5', dark: '#064E3B' }, 'card');

    const handleTimerEnd = () => {
        // Since we are not inside an async function, we can schedule the notification directly
        const message = isFocusMode
            ? "Focus session complete! Time for a break."
            : "Break's over! Time to focus.";
        
        scheduleNotification(message);

        const newModeIsFocus = !isFocusMode;
        setIsFocusMode(newModeIsFocus);
        setTimer(newModeIsFocus ? FOCUS_TIME_SECONDS : BREAK_TIME_SECONDS);
    };

    const scheduleNotification = async (body: string) => {
        await Notifications.scheduleNotificationAsync({
            content: { title: 'FocusFlow', body },
            trigger: null,
        });
    };

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimer((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(intervalRef.current as number); // We know it's a number here
                        setIsRunning(false);
                        handleTimerEnd();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        
        // This is the cleanup function that runs when the component unmounts or `isRunning` changes
        return () => {
            // THE FIX: Explicitly check for null before clearing.
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const handleStart = () => setIsRunning(true);
    const handlePause = () => setIsRunning(false);

    const handleReset = () => {
        setIsRunning(false);
        // THE FIX: Explicitly check for null here as well.
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }
        setTimer(isFocusMode ? FOCUS_TIME_SECONDS : BREAK_TIME_SECONDS);
    };
    
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={[styles.card, { backgroundColor: isFocusMode ? focusCardColor : breakCardColor }]}>
                <Text style={[styles.modeText, { color: textColor }]}>
                    {isFocusMode ? 'Focus Session' : 'Take a Break'}
                </Text>
                <Timer time={timer} color={textColor} />
            </View>
            <TimerControls
                isRunning={isRunning}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { width: '90%', padding: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
    modeText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true, }), });