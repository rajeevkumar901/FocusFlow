import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

// ... (setNotificationHandler and registerForPushNotificationsAsync are unchanged) ...
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() { /* ... */ }

// MODIFIED FUNCTION: It now only schedules and returns the ID.
export async function scheduleLocalNotification(title: string, body: string, date: Date) {
    try {
        if (date.getTime() <= new Date().getTime()) {
            console.error("Attempted to schedule a notification for a time in the past.");
            return null;
        }

        const trigger: Notifications.TimeIntervalTriggerInput = {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: (date.getTime() - new Date().getTime()) / 1000,
            repeats: false,
        };

        const identifier = await Notifications.scheduleNotificationAsync({
            content: { title, body, sound: 'default' },
            trigger,
        });
        
        // Return the ID on success
        return identifier;
    } catch (error) {
        console.error("Error scheduling notification: ", error);
        // Return null on failure
        return null;
    }
}