// components/mindfulness/BreathingExercise.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const BreathingExercise = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const textAnim = useRef(new Animated.Value(1)).current;
  const [text, setText] = React.useState('Breathe In');

  useEffect(() => {
    const cycle = () => {
      setText('Breathe In');
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 4000, // 4 seconds in
          useNativeDriver: true,
        }),
      ]).start(() => {
        setText('Breathe Out');
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 6000, // 6 seconds out
            useNativeDriver: true,
          }),
        ]).start(cycle);
      });
    };
    cycle();
  }, [scaleAnim]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Box Breathing</Text>
      <View style={styles.animationContainer}>
        <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]} />
        <Text style={styles.instructionText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 20,
  },
  animationContainer: {
    height: 150,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(52, 182, 132, 0.6)',
    position: 'absolute',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#064E3B',
  },
});

export default BreathingExercise;