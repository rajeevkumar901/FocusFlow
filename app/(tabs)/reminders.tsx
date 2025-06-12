import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, Alert, Pressable, FlatList } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { scheduleLocalNotification, registerForPushNotificationsAsync } from '../../services/notificationService';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, addDoc, onSnapshot, query, where, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

// Define the type for our Reminder object
interface Reminder {
  id: string;
  text: string;
  reminderDate: Date;
  userId: string;
  notificationId: string;
}

export default function RemindersScreen() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [date, setDate] = useState(new Date());
    const [reminderText, setReminderText] = useState('');
    const [scheduledReminders, setScheduledReminders] = useState<Reminder[]>([]);
    const [isPickerVisible, setPickerVisibility] = useState(false);

    // --- Theming Hooks ---
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const accentColor = useThemeColor({}, 'tint');
    const secondaryTextColor = useThemeColor({}, 'secondaryText');
    const buttonTextColor = useThemeColor({}, 'headerText');

    useEffect(() => {
        registerForPushNotificationsAsync();
        if (!user) {
            setScheduledReminders([]);
            return;
        }
        const remindersRef = collection(db, "reminders");
        const q = query(remindersRef, where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userReminders: Reminder[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                userReminders.push({
                    id: doc.id,
                    ...data,
                    reminderDate: data.reminderDate.toDate(), 
                } as Reminder);
            });
            setScheduledReminders(userReminders.sort((a,b) => a.reminderDate.getTime() - b.reminderDate.getTime()));
        });
        return () => unsubscribe();
    }, [user]);

    const showPicker = () => setPickerVisibility(true);
    const hidePicker = () => setPickerVisibility(false);

    const handleConfirm = (selectedDate: Date) => {
        setDate(selectedDate);
        hidePicker();
    };

    const handleScheduleReminder = async () => {
        if (!reminderText.trim() || !user) return;
        if (date <= new Date()) { Alert.alert('Invalid Time', 'Please select a future time for the reminder.'); return; }
        
        const notificationId = await scheduleLocalNotification('FocusFlow Reminder', reminderText, date);

        if (notificationId) {
            await addDoc(collection(db, "reminders"), {
                text: reminderText,
                reminderDate: date,
                userId: user.uid,
                notificationId: notificationId,
                createdAt: serverTimestamp(),
            });
            setReminderText('');
        }
    };

    const handleDeleteReminder = async (reminder: Reminder) => {
        Alert.alert("Delete Reminder", "Are you sure you want to delete this reminder?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                onPress: async () => {
                    await Notifications.cancelScheduledNotificationAsync(reminder.notificationId);
                    await deleteDoc(doc(db, "reminders", reminder.id));
                },
                style: "destructive"
            }
        ]);
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={[styles.title, { color: textColor }]}>Set a New Reminder</Text>
            
            <View style={[styles.inputContainer, {backgroundColor: cardColor}]}>
                <TextInput 
                    style={[styles.input, {color: textColor, borderColor}]} 
                    placeholder="Reminder text..." 
                    value={reminderText} 
                    onChangeText={setReminderText} 
                    placeholderTextColor={secondaryTextColor}
                />
                <Pressable style={styles.dateButton} onPress={showPicker}>
                    <Ionicons name="calendar-outline" size={24} color={accentColor} />
                </Pressable>
                <Pressable style={[styles.setButton, {backgroundColor: accentColor}]} onPress={handleScheduleReminder}>
                    <Text style={[styles.buttonText, {color: buttonTextColor}]}>Set</Text>
                </Pressable>
            </View>

            <DateTimePickerModal
                isVisible={isPickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hidePicker}
                date={date}
                minimumDate={new Date()}
                isDarkModeEnabled={theme === 'dark'}
            />

            <Text style={[styles.listHeader, {color: textColor}]}>Upcoming Reminders</Text>
            <FlatList
                data={scheduledReminders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.reminderItem, { backgroundColor: cardColor, borderColor: borderColor }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.reminderText, { color: textColor }]}>{item.text}</Text>
                            <Text style={{ color: secondaryTextColor }}>{item.reminderDate.toLocaleString()}</Text>
                        </View>
                        <Pressable onPress={() => handleDeleteReminder(item)} style={styles.deleteButton}>
                            <Ionicons name="trash-outline" size={22} color="#ff3b30" />
                        </Pressable>
                    </View>
                )}
                ListEmptyComponent={<Text style={{textAlign: 'center', color: secondaryTextColor}}>No upcoming reminders.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    inputContainer: { flexDirection: 'row', padding: 8, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
    input: { flex: 1, paddingHorizontal: 10, height: 40, marginRight: 10, borderBottomWidth: 1, fontSize: 16, },
    dateButton: { padding: 5, marginRight: 5 },
    setButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    buttonText: { fontWeight: 'bold' },
    listHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, },
    reminderItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1 },
    reminderText: { fontSize: 16, },
    deleteButton: { padding: 5 },
});
