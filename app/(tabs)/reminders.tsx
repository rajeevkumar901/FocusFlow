// app/(tabs)/reminders.tsx (Final Correction)
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, Alert, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { scheduleLocalNotification, registerForPushNotificationsAsync } from '../../services/notificationService';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function RemindersScreen() {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [reminderText, setReminderText] = useState('');

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const accentColor = useThemeColor({}, 'tint');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');
    const buttonTextColor = useThemeColor({}, 'headerText'); // 👈 Get the new contrasting color

    useEffect(() => { registerForPushNotificationsAsync(); }, []);
    
    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        if (selectedDate) { setDate(currentDate); }
    };

    const handleScheduleReminder = () => {
        if (!reminderText.trim()) { Alert.alert('Missing Title', 'Please enter a title for your reminder.'); return; }
        if (date <= new Date()) { Alert.alert('Invalid Time', 'Please select a future time for the reminder.'); return; }
        scheduleLocalNotification('FocusFlow Reminder', reminderText, date);
        setReminderText('');
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={[styles.title, { color: textColor }]}>Set a New Reminder</Text>
            <TextInput
                style={[styles.input, { backgroundColor: cardColor, color: textColor, borderColor }]}
                placeholder="e.g., Time to take a walk"
                placeholderTextColor={secondaryTextColor}
                value={reminderText}
                onChangeText={setReminderText}
            />
            
            <Pressable style={[styles.button, { backgroundColor: accentColor }]} onPress={() => setShowPicker(true)}>
                <Text style={[styles.buttonText, { color: buttonTextColor }]}>Change Date & Time</Text>{/* 👈 Use new color */}
            </Pressable>

            {showPicker && ( <DateTimePicker testID="dateTimePicker" value={date} mode="datetime" display="default" onChange={onChange} minimumDate={new Date()} /> )}
            
            <View style={{ marginTop: 20 }}>
                <Pressable style={[styles.button, { backgroundColor: accentColor }]} onPress={handleScheduleReminder}>
                    <Text style={[styles.buttonText, { color: buttonTextColor }]}>Schedule Reminder</Text>{/* 👈 Use new color */}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60, },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, fontSize: 16, marginBottom: 20, borderWidth: 1, },
    button: { padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10, },
    buttonText: { fontSize: 16, fontWeight: 'bold', },
});