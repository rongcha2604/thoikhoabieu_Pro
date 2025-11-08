import { Capacitor, registerPlugin } from '@capacitor/core';
import type { Subject } from '../types';

// Capacitor plugin interface
interface TimetableStoragePlugin {
  saveSubjects(options: { subjects: Subject[] }): Promise<void>;
  getSubjects(): Promise<{ subjects: string }>;
}

// Register plugin (Capacitor 3+ way)
const TimetableStorage = registerPlugin<TimetableStoragePlugin>('TimetableStorage');

/**
 * Sync thời khóa biểu với Android widget
 * Chỉ hoạt động trên Android native platform
 */
export const syncWithWidget = async (subjects: Subject[]): Promise<void> => {
  // Chỉ sync trên Android
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    console.log('[Widget Sync] Not on Android, skipping sync');
    return;
  }

  try {
    await TimetableStorage.saveSubjects({ subjects });
    console.log('[Widget Sync] ✅ Successfully synced', subjects.length, 'subjects to widget');
  } catch (error) {
    console.error('[Widget Sync] ❌ Failed to sync subjects:', error);
  }
};

/**
 * Lấy thời khóa biểu từ Android storage
 */
export const getSubjectsFromWidget = async (): Promise<Subject[]> => {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    return [];
  }

  try {
    const result = await TimetableStorage.getSubjects();
    const subjects = JSON.parse(result.subjects);
    return subjects;
  } catch (error) {
    console.error('[Widget Sync] Failed to get subjects:', error);
    return [];
  }
};

