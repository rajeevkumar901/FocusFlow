// components/Timer.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

// A helper function to format the time
const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

type TimerProps = {
    time: number;
};

const Timer = ({ time }: TimerProps) => {
    return <Text style={styles.timerText}>{formatTime(time)}</Text>;
};

const styles = StyleSheet.create({
    timerText: {
        fontSize: 80,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'monospace', // Gives a digital clock feel
    },
});

export default Timer;