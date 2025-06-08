// components/TimerControls.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

type TimerControlsProps = {
    isRunning: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
};

const TimerControls = ({ isRunning, onStart, onPause, onReset }: TimerControlsProps) => {
    return (
        <View style={styles.container}>
            {!isRunning ? (
                <Button title="Start Focus" onPress={onStart} />
            ) : (
                <Button title="Pause" onPress={onPause} color="#FFA500" />
            )}
            <Button title="Reset" onPress={onReset} color="#ff6347" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: 40,
    },
});

export default TimerControls;