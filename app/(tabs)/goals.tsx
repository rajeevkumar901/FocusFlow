// app/(tabs)/goals.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import GoalItem from '../../components/GoalItem'; // Adjust path if needed

// We'll manage goals with state for now.
const initialGoals = [
  { id: '1', text: '3 focus sessions today', achieved: true },
  { id: '2', text: '< 2 hrs on social media', achieved: false },
  { id: '3', text: 'Read for 30 minutes', achieved: false },
];

export default function GoalsScreen() {
  const [goals, setGoals] = useState(initialGoals);

  const toggleGoal = (id: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, achieved: !goal.achieved } : goal
      )
    );
  };

  const achievedCount = goals.filter(g => g.achieved).length;
  const totalCount = goals.length;
  const progress = totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Goals</Text>
        <Text style={styles.progressText}>
          {achievedCount} of {totalCount} completed
        </Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <FlatList
        data={goals}
        renderItem={({ item }) => (
          <GoalItem
            text={item.text}
            isAchieved={item.achieved}
            onToggle={() => toggleGoal(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 24,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginTop: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
});