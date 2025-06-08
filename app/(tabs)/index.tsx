// app/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Timer from '@/components/Timer';
import TimerControls from '@/components/TimerControls';

// --- Constants for Timer ---
const FOCUS_TIME_SECONDS = 25 * 60; // 25 minutes
const BREAK_TIME_SECONDS = 5 * 60;  // 5 minutes

// --- Notification Handler ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    // Add these two properties to fix the error
    shouldShowBanner: true, 
    shouldShowList: true,
  }),
});

// --- Main Screen Component ---
export default function FocusSessionScreen() {
    const [timer, setTimer] = useState(FOCUS_TIME_SECONDS);
    const [isRunning, setIsRunning] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(true);
    const intervalRef = useRef<number | null>(null);

    // Effect to handle the countdown logic
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimer((prevTime) => {
                    if (prevTime <= 1) {
                        handleTimerEnd();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const handleTimerEnd = async () => {
        setIsRunning(false);
        const message = isFocusMode 
            ? "Focus session complete! Time for a break." 
            : "Break's over! Time to focus.";
        
        await scheduleNotification(message);

        // Switch modes and reset timer
        const newModeIsFocus = !isFocusMode;
        setIsFocusMode(newModeIsFocus);
        setTimer(newModeIsFocus ? FOCUS_TIME_SECONDS : BREAK_TIME_SECONDS);
    };

    const scheduleNotification = async (body: string) => {
        // Request permissions first for iOS
        if (Platform.OS === 'ios') {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('You need to enable notifications for the timer alerts to work.');
                return;
            }
        }
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'FocusFlow',
                body,
            },
            trigger: null, // send immediately
        });
    };

    const handleStart = () => setIsRunning(true);
    const handlePause = () => setIsRunning(false);
    const handleReset = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        setTimer(isFocusMode ? FOCUS_TIME_SECONDS : BREAK_TIME_SECONDS);
    };

    return (
        <View style={styles.container}>
            <View style={[styles.card, isFocusMode ? styles.focusBg : styles.breakBg]}>
                <Text style={styles.modeText}>
                    {isFocusMode ? 'Focus Session' : 'Take a Break'}
                </Text>
                <Timer time={timer} />
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

// --- Styles ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    card: {
        width: '90%',
        padding: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    focusBg: {
        backgroundColor: '#E0E7FF', // A light blue for focus
    },
    breakBg: {
        backgroundColor: '#D1FAE5', // A light green for break
    },
    modeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#374151',
    },
});