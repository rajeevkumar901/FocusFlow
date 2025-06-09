// components/Timer.tsx (Corrected)
import React from 'react';
import { StyleSheet, Text } from 'react-native';

/**
 * This function takes a number of seconds and formats it into a MM:SS string.
 * It always returns a string, which prevents the error you're seeing.
 */
const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    // This line ensures a string is always returned.
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// The type for the component's props
type TimerProps = {
    time: number;
    color: string;
};

/**
 * This is the Timer component. It is a function that always returns a <Text> element,
 * which satisfies its requirement to return a renderable component.
 */
const Timer = ({ time, color }: TimerProps) => {
    return <Text style={[styles.timerText, { color }]}>{formatTime(time)}</Text>;
};

const styles = StyleSheet.create({
    timerText: {
        fontSize: 80,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
});

export default Timer;