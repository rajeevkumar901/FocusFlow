import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, FlatList, Platform } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleLocalNotification, registerForPushNotificationsAsync } from '../../services/notificationService';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';
import { collection, addDoc, onSnapshot, query, where, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

// Define the type for our Reminder object from Firestore
interface Reminder {
  id: string; // The Firestore document ID
  text: string;
  reminderDate: Date;
  userId: string;
  notificationId: string; // The OS notification ID
  createdAt: any;
}

export default function RemindersScreen() {
    const { user } = useAuth();
    const [date, setDate] = useState(new Date());
    const [reminderText, setReminderText] = useState('');
    const [scheduledReminders, setScheduledReminders] = useState<Reminder[]>([]);
    const [showPickerForIos, setShowPickerForIos] = useState(false);

    // --- Theming and other hooks ---
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
        // Listen for real-time updates to the reminders collection
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

    const handleScheduleReminder = async () => {
        if (!reminderText.trim() || !user) return;
        if (date <= new Date()) { Alert.alert('Invalid Time', 'Please select a future time for the reminder.'); return; }
        
        const notificationId = await scheduleLocalNotification('FocusFlow Reminder', reminderText, date);

        // This is the debugging step
        console.log('Received Notification ID from service:', notificationId);

        if (notificationId) {
            try {
                await addDoc(collection(db, "reminders"), {
                    text: reminderText,
                    reminderDate: date,
                    userId: user.uid,
                    notificationId: notificationId,
                    createdAt: serverTimestamp(),
                });
                Alert.alert("Success", "Reminder has been set and saved!");
                setReminderText('');
            } catch (error) {
                Alert.alert("Save Error", "The reminder was set on your phone, but could not be saved to your account.");
                console.error("Error saving reminder to Firestore: ", error);
            }
        } else {
            Alert.alert("Error", "Failed to schedule the reminder on your device.");
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

    const showDateTimePicker = () => {
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: date,
                mode: 'date',
                minimumDate: new Date(),
                onChange: (dateEvent, selectedDate) => {
                    if (dateEvent.type === 'set' && selectedDate) {
                        DateTimePickerAndroid.open({
                            value: selectedDate,
                            mode: 'time',
                            onChange: (timeEvent, selectedTime) => {
                                if (timeEvent.type === 'set' && selectedTime) {
                                    const finalDate = new Date(selectedDate);
                                    finalDate.setHours(selectedTime.getHours());
                                    finalDate.setMinutes(selectedTime.getMinutes());
                                    setDate(finalDate);
                                }
                            }
                        });
                    }
                },
            });
        } else {
            setShowPickerForIos(true);
        }
    };
    
    const onIosChange = (event: any, selectedDate?: Date) => {
        setShowPickerForIos(false);
        if (selectedDate) setDate(selectedDate);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: textColor }]}>Set a New Reminder</Text>
            <View style={[styles.inputContainer, {backgroundColor: cardColor}]}>
                <TextInput style={[styles.input, {color: textColor, borderBottomColor: borderColor}]} placeholder="Reminder text..." value={reminderText} onChangeText={setReminderText} placeholderTextColor={secondaryTextColor}/>
                <Pressable style={styles.dateButton} onPress={showDateTimePicker}>
                    <Ionicons name="calendar-outline" size={24} color={accentColor} />
                </Pressable>
                <Pressable style={[styles.setButton, {backgroundColor: accentColor}]} onPress={handleScheduleReminder}>
                    <Text style={[styles.buttonText, {color: buttonTextColor}]}>Set</Text>
                </Pressable>
            </View>

            {showPickerForIos && ( <DateTimePicker value={date} mode="datetime" display="spinner" onChange={onIosChange}/> )}

            <Text style={[styles.listHeader, {color: textColor}]}>Upcoming Reminders</Text>
            <FlatList
                data={scheduledReminders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.reminderItem, { backgroundColor: cardColor }]}>
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
    reminderItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 10 },
    reminderText: { fontSize: 16, },
    deleteButton: { padding: 5 },
});