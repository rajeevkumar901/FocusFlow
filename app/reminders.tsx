// app/reminders.tsx (Corrected)
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { scheduleLocalNotification, registerForPushNotificationsAsync } from '../services/notificationService';

export default function RemindersScreen() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [reminderText, setReminderText] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const handleScheduleReminder = () => {
    if (!reminderText.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your reminder.');
      return;
    }
    if (date <= new Date()) {
      Alert.alert('Invalid Time', 'Please select a future time for the reminder.');
      return;
    }

    scheduleLocalNotification('FocusFlow Reminder', reminderText, date);
    setReminderText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set a New Reminder</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Time to take a walk"
        value={reminderText}
        onChangeText={setReminderText}
      />

      <View style={styles.datePickerContainer}>
        <Text style={styles.dateText}>Selected Time: {date.toLocaleString()}</Text>
        {Platform.OS !== 'ios' && (
          <Button onPress={showDatePicker} title="Change Date & Time" />
        )}
      </View>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="datetime"
          display="default"
          onChange={onChange}
          minimumDate={new Date()}
          // CORRECTED: The is24Hour prop is now only applied on Android
          {...(Platform.OS === 'android' && { is24Hour: true })}
        />
      )}
      
      <View style={styles.buttonWrapper}>
        <Button
            title="Schedule Reminder"
            onPress={handleScheduleReminder}
            color="#6200ee"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  datePickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonWrapper: {
    marginTop: 20,
  },
});