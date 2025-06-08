// components/GoalItem.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type GoalItemProps = {
  text: string;
  isAchieved: boolean;
  onToggle: () => void;
};

const GoalItem = ({ text, isAchieved, onToggle }: GoalItemProps) => {
  return (
    <Pressable onPress={onToggle} style={styles.container}>
      <View style={styles.goalTextContainer}>
        <Ionicons
          name={isAchieved ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={isAchieved ? "#4CAF50" : "#6200ee"}
        />
        <Text style={[styles.goalText, isAchieved && styles.achievedText]}>
          {text}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  goalTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalText: {
    fontSize: 16,
    marginLeft: 12,
  },
  achievedText: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
});

export default GoalItem;