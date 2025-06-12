import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import GoalItem from '../../components/GoalItem';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Pressable } from 'react-native';

interface Goal {
  id: string;
  text: string;
  achieved: boolean;
  userId: string;
  createdAt: any;
}

export default function GoalsScreen() {
    const { user } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [newGoalText, setNewGoalText] = useState('');

    // --- Theming Hooks ---
    const backgroundColor = useThemeColor({}, 'background');
    const accentColor = useThemeColor({}, 'tint');
    const headerTextColor = useThemeColor({}, 'headerText');
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({}, 'border');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');

    // --- Data Fetching and Logic (no changes here) ---
    useEffect(() => {
        if (!user) { setGoals([]); return; }
        const goalsRef = collection(db, "goals");
        const q = query(goalsRef, where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userGoals: Goal[] = [];
            querySnapshot.forEach((doc) => {
                userGoals.push({ id: doc.id, ...doc.data() } as Goal);
            });
            setGoals(userGoals.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds));
        });
        return () => unsubscribe();
    }, [user]);

    const handleAddGoal = async () => { /* ... same logic ... */ };
    const toggleGoal = async (goal: Goal) => { /* ... same logic ... */ };
    const handleDeleteGoal = (goalId: string) => { /* ... same logic ... */ };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={[styles.header, { backgroundColor: accentColor }]}>
                <Text style={[styles.title, { color: headerTextColor }]}>Daily Goals</Text>
            </View>

            <View style={[styles.inputContainer, { backgroundColor: cardColor, borderColor: borderColor }]}>
                <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="Add a new goal..."
                    placeholderTextColor={secondaryTextColor}
                    value={newGoalText}
                    onChangeText={setNewGoalText}
                    onSubmitEditing={handleAddGoal}
                />
                <Pressable style={[styles.addButton, { backgroundColor: accentColor }]} onPress={handleAddGoal}>
                    <Text style={{color: headerTextColor, fontWeight: 'bold'}}>Add</Text>
                </Pressable>
            </View>

            <FlatList
                data={goals}
                renderItem={({ item }) => (
                    <GoalItem
                        text={item.text}
                        isAchieved={item.achieved}
                        onToggle={() => toggleGoal(item)}
                        onDelete={() => handleDeleteGoal(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ marginHorizontal: 16, backgroundColor: cardColor, borderRadius: 10 }}
                ListEmptyComponent={<Text style={{textAlign: 'center', padding: 20, color: secondaryTextColor}}>No goals yet. Add one!</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 24, paddingTop: 60, paddingBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        margin: 16,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    addButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
});
