import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert } from 'react-native';
import GoalItem from '../../components/GoalItem';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Define the type for our Goal object from Firestore
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

    const backgroundColor = useThemeColor({}, 'background');
    const accentColor = useThemeColor({}, 'tint');
    const headerTextColor = useThemeColor({}, 'headerText');
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({}, 'border');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');

    // Effect to listen for real-time updates to goals
    useEffect(() => {
        if (!user) {
            setGoals([]); // Clear goals if user logs out
            return;
        }

        const goalsRef = collection(db, "goals");
        const q = query(goalsRef, where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userGoals: Goal[] = [];
            querySnapshot.forEach((doc) => {
                userGoals.push({ id: doc.id, ...doc.data() } as Goal);
            });
            // Sort goals by creation time
            setGoals(userGoals.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds));
        });

        return () => unsubscribe();
    }, [user]);

    // Function to add a new goal to Firestore
    const handleAddGoal = async () => {
        if (!newGoalText.trim() || !user) return;

        try {
            await addDoc(collection(db, "goals"), {
                text: newGoalText,
                achieved: false,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
            setNewGoalText('');
        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert("Error", "Could not save your goal. Please try again.");
        }
    };

    // Function to toggle a goal's 'achieved' status
    const toggleGoal = async (goal: Goal) => {
        const goalRef = doc(db, "goals", goal.id);
        await updateDoc(goalRef, {
            achieved: !goal.achieved
        });
    };

    // Function to delete a goal
    const handleDeleteGoal = (goalId: string) => {
        Alert.alert(
            "Delete Goal",
            "Are you sure you want to permanently delete this goal?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const goalRef = doc(db, "goals", goalId);
                            await deleteDoc(goalRef);
                        } catch (e) {
                            console.error("Error deleting document: ", e);
                            Alert.alert("Error", "Could not delete the goal.");
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };

    const achievedCount = goals.filter(g => g.achieved).length;
    const totalCount = goals.length;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={[styles.header, { backgroundColor: accentColor }]}>
                <Text style={[styles.title, { color: headerTextColor }]}>Daily Goals</Text>
                <Text style={[styles.progressText, { color: headerTextColor, opacity: 0.9 }]}>
                    {achievedCount} of {totalCount} completed
                </Text>
            </View>

            <View style={[styles.inputContainer, { backgroundColor: cardColor }]}>
                <TextInput
                    style={[styles.input, { color: textColor, borderBottomColor: borderColor }]}
                    placeholder="Add a new goal..."
                    placeholderTextColor={secondaryTextColor}
                    value={newGoalText}
                    onChangeText={setNewGoalText}
                    onSubmitEditing={handleAddGoal} // Allows submitting with the keyboard's return key
                />
                <Button title="Add" onPress={handleAddGoal} color={accentColor} />
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
                contentContainerStyle={{ paddingHorizontal: 16 }}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20, color: secondaryTextColor}}>No goals yet. Add one!</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 24, paddingTop: 50, paddingBottom: 16, marginBottom: 10, },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
    progressText: { fontSize: 16, textAlign: 'center', marginTop: 8, },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 3,
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: 40,
        borderBottomWidth: 1,
        marginRight: 10,
        fontSize: 16,
    },
});