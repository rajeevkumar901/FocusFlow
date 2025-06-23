import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

type GoalItemProps = {
  text: string;
  isAchieved: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

const GoalItem = ({ text, isAchieved, onToggle, onDelete }: GoalItemProps) => {
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');
    const tintColor = useThemeColor({}, 'tint');
    const borderColor = useThemeColor({}, 'border');

    return (
        <View style={[styles.container, { backgroundColor: cardColor, borderBottomColor: borderColor }]}>
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

            <Pressable onPress={onDelete} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={22} color="#ff3b30" />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 18,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
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
    },
    deleteButton: {
        padding: 5,
        marginLeft: 10,
    }
});

export default GoalItem;