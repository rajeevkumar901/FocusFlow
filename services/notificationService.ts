// services/notificationService.ts (Definitive Corrected Version)
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get permissions for notifications!');
  }
}

export async function scheduleLocalNotification(title: string, body: string, date: Date) {
  const secondsUntil = (date.getTime() - new Date().getTime()) / 1000;

  if (secondsUntil <= 0) {
      console.log("Attempted to schedule a notification for a time in the past.");
      return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: 'default',
    },
    // TEMPORARY WORKAROUND: Add 'as any' at the end of the trigger object
    trigger: {
      seconds: secondsUntil,
    } as any, 
  });
  
  alert(`Reminder set for ${date.toLocaleString()}`);
}