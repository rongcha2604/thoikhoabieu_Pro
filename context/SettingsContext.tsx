import React, { createContext, useEffect } from 'react';
import type { Settings, Theme, Language, Period } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CLASS_PERIODS, TRANSLATIONS } from '../constants';

interface SettingsContextType {
  settings: Settings;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleNotifications: () => void;
  theme: Theme;
  language: Language;
  classPeriods: {
    morning: Period[];
    afternoon: Period[];
  };
  updateClassPeriods: (newPeriods: { morning: Period[]; afternoon: Period[] }) => void;
  timetableTitle: string;
  updateTimetableTitle: (newTitle: string) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  theme: 'light',
  language: 'vi',
  notifications: true,
  classPeriods: CLASS_PERIODS,
  timetableTitle: TRANSLATIONS['vi'].timetable,
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setTheme: () => {},
  setLanguage: () => {},
  toggleNotifications: () => {},
  theme: 'light',
  language: 'vi',
  classPeriods: CLASS_PERIODS,
  updateClassPeriods: () => {},
  timetableTitle: defaultSettings.timetableTitle,
  updateTimetableTitle: () => {},
  updateSettings: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<Settings>('timetable_settings', defaultSettings);

  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const setTheme = (theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const setLanguage = (language: Language) => {
    setSettings(prev => ({ ...prev, language }));
  };

  const toggleNotifications = () => {
    setSettings(prev => ({ ...prev, notifications: !prev.notifications }));
  };
  
  const updateClassPeriods = (newPeriods: { morning: Period[]; afternoon: Period[] }) => {
    setSettings(prev => ({ ...prev, classPeriods: newPeriods }));
  };

  const updateTimetableTitle = (newTitle: string) => {
    setSettings(prev => ({ ...prev, timetableTitle: newTitle }));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    console.log('[SettingsContext] Updating settings:', newSettings);
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      setTheme, 
      setLanguage, 
      toggleNotifications, 
      theme: settings.theme, 
      language: settings.language,
      classPeriods: settings.classPeriods,
      updateClassPeriods,
      timetableTitle: settings.timetableTitle,
      updateTimetableTitle,
      updateSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
