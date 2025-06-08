// components/GoalItem.tsx (Updated with Delete Button)
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';

type GoalItemProps = {
  text: string;
  isAchieved: boolean;
  onToggle: () => void;
  onDelete: () => void; // 👈 Add a new prop for the delete function
};

const GoalItem = ({ text, isAchieved, onToggle, onDelete }: GoalItemProps) => {
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');
    const tintColor = useThemeColor({}, 'tint');

    return (
        <View style={[styles.container, { backgroundColor: cardColor }]}>
            <Pressable onPress={onToggle} style={styles.goalTextContainer}>
                <Ionicons
                    name={isAchieved ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={isAchieved ? "#4CAF50" : tintColor}
                />
                <Text style={[styles.goalText, { color: isAchieved ? secondaryTextColor : textColor }, isAchieved && styles.achievedText]}>
                    {text}
                </Text>
            </Pressable>

            {/* 👇 This is the new Delete button */}
            <Pressable onPress={onDelete} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={22} color="#ff3b30" />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 18,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        elevation: 2,
    },
    goalTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Allow this to take up most of the space
    },
    goalText: {
        fontSize: 16,
        marginLeft: 12,
    },
    achievedText: {
        textDecorationLine: 'line-through',
    },
    deleteButton: {
        padding: 5,
        marginLeft: 10,
    }
});

export default GoalItem;