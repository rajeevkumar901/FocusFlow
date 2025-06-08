// components/mindfulness/FocusQuote.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FocusQuote = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Quote of the Day</Text>
      <Text style={styles.quoteText}>"The key is not to prioritize what's on your schedule, but to schedule your priorities."</Text>
      <Text style={styles.authorText}>- Stephen Covey</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#4B5563',
  },
  authorText: {
    fontSize: 14,
    marginTop: 10,
    color: '#4B5563',
  },
});

export default FocusQuote;