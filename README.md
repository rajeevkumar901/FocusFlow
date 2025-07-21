# FocusFlow: Mobile Usage Monitoring and Control App

**An integrated productivity & digital wellness companion for Android**

## Overview

FocusFlow is an all-in-one Android application designed to help users monitor, control, and improve their mobile usage habits. By combining real-time app usage tracking, focus session management, app blocking, cloud-synced goal tracking, and mindful productivity tools in a single native solution, FocusFlow supports healthier digital habits and a more balanced relationship with technology.

## Features

- **App Usage Statistics:** Real-time tracking and visualization of app usage (Today, Week, Month) using Android’s system APIs.
- **Persistent App Blocking:** Set custom daily time limits for any app, enforced by a native background service.
- **Customizable Pomodoro Timer:** Integrated with Do Not Disturb (DND) mode for distraction-free focus sessions.
- **Goal Management:** Cloud-synced feature (Firestore) to set, track, and achieve productivity goals.
- **Custom Reminders:** Schedule notifications for important tasks or breaks.
- **Mindfulness Tools:** Guided breathing exercises and calm sounds for stress relief.
- **Light & Dark Mode:** Complete, persistent support for theme customization.
- **Secure Authentication:** Firebase Authentication ensures user account safety and session management.

## Why FocusFlow?

- **Unified Solution:** Combines productivity tools into one seamless interface, eliminating fragmented workflows.
- **Actionable Insights:** Directly links usage data with goal setting and time limits, enabling immediate habit improvements.
- **Holistic Approach:** Balances motivational tools and positive reinforcement with effective restriction.
- **Personalization:** All settings, goals, and limits are cloud-synced and persist across devices.
- **Native Performance:** Built with React Native (Expo) and custom Kotlin modules for accurate tracking and high responsiveness.
- **User-Centric Design:** Clean, intuitive UI adaptable for all users and supported in both light and dark modes[1].

## Modules & Architecture

| Module                  | Description                                                                      |
|-------------------------|----------------------------------------------------------------------------------|
| **Authentication**      | Secure sign-up, login, logout, and session persistence.                          |
| **Focus Timer**         | Pomodoro-inspired timer with configurable durations and automatic DND handling.   |
| **Usage Stats**         | Accurate app usage analytics with real-time updates and native app icons.         |
| **Goal Tracking**       | Full CRUD operations for productivity goals, with real-time Firestore sync.       |
| **App Blocking**        | Daily time limits and instant blocking using Android Accessibility Service.       |
| **Reminders**           | Schedule and manage custom notifications for tasks and breaks.                   |
| **Settings**            | Theme toggle, account management, and quick access to permissions/help.           |
| **Mindfulness**         | Built-in resources for relaxation and digital balance.                           |

## Quick Start

### 1. Requirements

- Android 8.0 (Oreo) or higher
- 3GB RAM+
- Internet connection (for sync features)

### 2. Installation

- Obtain and install the FocusFlow.apk.
- Enable installation from unknown sources if prompted.
- On first launch, create an account or sign in with email.

### 3. Permissions

- Grant Usage Access for tracking.
- Enable Accessibility Service for app blocking.
- Allow DND control for focus sessions.

### 4. Using FocusFlow

- **Focus:** Set timer, start session—DND activates automatically.
- **Stats:** Review app usage in clear, time-based graphs.
- **Goals:** Add, check-off, or delete productivity goals.
- **App Limits:** Quickly set or adjust daily app time limits.
- **Reminders:** Schedule, edit, or remove notifications.
- **Settings:** Personalize theme and account preferences.
- **Mindfulness:** Access guided breathing and calming audio.

## Technologies Used

- **React Native (Expo)**
- **Kotlin (Native Android Modules)**
- **TypeScript**
- **Firebase Authentication & Firestore**
- **Expo Notifications**
- **AsyncStorage & SharedPreferences for device persistence**

## Project Structure

- `app/` – All screens and navigation.
- `assets/` – Fonts, images, and static files.
- `components/` – Reusable UI elements.
- `context/` – React contexts (Theme, Auth).
- `services/` – Interfaces for API, notifications, and native functions.
- `android/` – Native code (Kotlin modules for stats & blocking).

## Contributing

1. Fork this repository.
2. Clone your fork.
3. Install dependencies (Yarn/npm, Expo CLI, Android Studio SDK).
4. Set up your Firebase project and add credentials to `firebaseConfig.ts`.
5. Develop new features or improve existing ones by submitting a Pull Request.

## License

This project is intended for educational and personal productivity use. See LICENSE for details.

## Contact

For questions or collaboration, contact the original developer:  
**Rajeev Kumar** | Dept. of Computer Science Engineering, GJUST, Hisar

**Empower your digital wellness journey with FocusFlow!**
