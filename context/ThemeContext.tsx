// context/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useSystemColorScheme() ?? 'light';
  const [theme, setTheme] = useState<Theme>(systemTheme);

  useEffect(() => {
    // Load saved theme from storage
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('app-theme') as Theme;
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (e) {
        console.error("Failed to load theme from storage", e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('app-theme', newTheme);
    } catch (e) {
      console.error("Failed to save theme to storage", e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};