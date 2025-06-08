// constants/Colors.ts (Final Correction)
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#f2f2f7',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    border: '#ccc',
    secondaryText: '#8e8e93',
    headerText: '#fff', // 👈 ADD THIS: White text for the light theme's tint
  },
  dark: {
    text: '#ECEDEE',
    background: '#000000',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#1c1c1e',
    border: '#38383a',
    secondaryText: '#8e8e93',
    headerText: '#11181C', // 👈 ADD THIS: Dark text for the dark theme's tint (which is white)
  },
};