import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsContext } from '../context/SettingsContext';
import { TRANSLATIONS, CLASS_PERIODS } from '../constants';
import { CloseIcon, LightModeIcon, DarkModeIcon } from './icons';
import { deleteDB } from 'idb';
import { Capacitor } from '@capacitor/core';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, setTheme, setLanguage, updateClassPeriods, language, timetableTitle, updateTimetableTitle, updateSettings } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleTimeChange = (session: 'morning' | 'afternoon', index: number, field: 'startTime' | 'endTime', value: string) => {
    const newPeriods = JSON.parse(JSON.stringify(settings.classPeriods)); // Deep copy
    newPeriods[session][index][field] = value;
    updateClassPeriods(newPeriods);
  };

  const clearAllData = async () => {
    try {
      // 1. Xóa localStorage
      localStorage.removeItem('timetable_subjects');
      localStorage.removeItem('timetable_settings');
      
      // 2. Xóa IndexedDB (homework database)
      try {
        // Xóa database trực tiếp
        await deleteDB('timetable-homework');
        console.log('✅ IndexedDB deleted successfully');
      } catch (error) {
        console.error('Failed to delete IndexedDB:', error);
        // Thử xóa lại sau khi đợi một chút (có thể có connection đang mở)
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          await deleteDB('timetable-homework');
          console.log('✅ IndexedDB deleted successfully (retry)');
        } catch (retryError) {
          console.error('Failed to delete IndexedDB after retry:', retryError);
          // Vẫn tiếp tục dù có lỗi
        }
      }
      
      // 3. Xóa widget storage (Android)
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
        try {
          const { registerPlugin } = await import('@capacitor/core');
          const TimetableStorage = registerPlugin<any>('TimetableStorage');
          await TimetableStorage.saveSubjects({ subjects: [] });
          console.log('✅ Widget storage cleared');
        } catch (error) {
          console.error('Failed to clear widget storage:', error);
          // Vẫn tiếp tục dù có lỗi
        }
      }
      
      // 4. Reset settings về mặc định
      const defaultSettings = {
        theme: 'light' as const,
        language: 'vi' as const,
        notifications: true,
        classPeriods: CLASS_PERIODS,
        timetableTitle: TRANSLATIONS.vi.timetable,
      };
      updateSettings(defaultSettings);
      
      // 5. Reload page để reset toàn bộ state
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error('Failed to clear all data:', error);
      alert((language === 'vi' ? 'Có lỗi xảy ra: ' : 'Error: ') + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleClearAllData = () => {
    setShowConfirmDialog(true);
  };

  const confirmClearAllData = () => {
    setShowConfirmDialog(false);
    clearAllData();
  };

  const cancelClearAllData = () => {
    setShowConfirmDialog(false);
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl w-full max-w-md p-6" 
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t.settings}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Title Setting */}
          <div>
            <label htmlFor="timetableTitle" className="block text-lg font-semibold mb-2">{t.title}</label>
            <input
              id="timetableTitle"
              type="text"
              value={timetableTitle}
              onChange={(e) => updateTimetableTitle(e.target.value)}
              className="block w-full bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-lg shadow-sm p-3"
              placeholder={TRANSLATIONS.vi.timetable}
            />
          </div>
          
          {/* Theme Setting */}
          <div>
            <label className="block text-lg font-semibold mb-2">{t.theme}</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${settings.theme === 'light' ? 'bg-primary-light text-white' : 'bg-background-light dark:bg-slate-600'}`}
              >
                <LightModeIcon className="w-5 h-5" />
                <span>{t.light}</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${settings.theme === 'dark' ? 'bg-primary-dark text-white' : 'bg-background-light dark:bg-slate-600'}`}
              >
                <DarkModeIcon className="w-5 h-5" />
                <span>{t.dark}</span>
              </button>
            </div>
          </div>

          {/* Language Setting */}
          <div>
            <label className="block text-lg font-semibold mb-2">{t.language}</label>
             <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('vi')}
                className={`flex-1 p-3 rounded-lg transition-colors ${settings.language === 'vi' ? 'bg-primary-light dark:bg-primary-dark text-white' : 'bg-background-light dark:bg-slate-600'}`}
              >
                {t.vietnamese}
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex-1 p-3 rounded-lg transition-colors ${settings.language === 'en' ? 'bg-primary-light dark:bg-primary-dark text-white' : 'bg-background-light dark:bg-slate-600'}`}
              >
                {t.english}
              </button>
            </div>
          </div>

          {/* Period Times Setting */}
          <div>
            <label className="block text-lg font-semibold mb-2">{t.period_times}</label>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <h4 className="font-semibold text-md text-text-muted-light dark:text-text-muted-dark mb-1">{t.morning}</h4>
                {settings.classPeriods.morning.map((p, index) => (
                  <div key={`m-p-${index}`} className="flex items-center space-x-2 text-sm mb-1">
                    <span className="w-12 font-medium">{t.period} {p.period}</span>
                    <input type="time" value={p.startTime} onChange={(e) => handleTimeChange('morning', index, 'startTime', e.target.value)} className="bg-background-light dark:bg-slate-700 border-border-light dark:border-border-dark rounded-md p-1 w-full" />
                    <span className="text-text-muted-light dark:text-text-muted-dark">-</span>
                    <input type="time" value={p.endTime} onChange={(e) => handleTimeChange('morning', index, 'endTime', e.target.value)} className="bg-background-light dark:bg-slate-700 border-border-light dark:border-border-dark rounded-md p-1 w-full" />
                  </div>
                ))}
              </div>
               <div>
                <h4 className="font-semibold text-md text-text-muted-light dark:text-text-muted-dark mb-1">{t.afternoon}</h4>
                {settings.classPeriods.afternoon.map((p, index) => (
                  <div key={`a-p-${index}`} className="flex items-center space-x-2 text-sm mb-1">
                    <span className="w-12 font-medium">{t.period} {p.period}</span>
                    <input type="time" value={p.startTime} onChange={(e) => handleTimeChange('afternoon', index, 'startTime', e.target.value)} className="bg-background-light dark:bg-slate-700 border-border-light dark:border-border-dark rounded-md p-1 w-full" />
                    <span className="text-text-muted-light dark:text-text-muted-dark">-</span>
                    <input type="time" value={p.endTime} onChange={(e) => handleTimeChange('afternoon', index, 'endTime', e.target.value)} className="bg-background-light dark:bg-slate-700 border-border-light dark:border-border-dark rounded-md p-1 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Clear All Data */}
          <div className="border-t border-border-light dark:border-border-dark pt-6">
            <label className="block text-lg font-semibold mb-2 text-red-600 dark:text-red-400">
              {t.clearAllData}
            </label>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
              {t.clearAllDataWarning}
            </p>
            <button
              onClick={handleClearAllData}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              {t.clearAllData}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog - Xác nhận xóa */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelClearAllData}
          >
            <motion.div
              className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
                {t.clearAllData}
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
                {t.clearAllDataConfirm}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelClearAllData}
                  className="flex-1 px-4 py-2 bg-background-light dark:bg-slate-600 rounded-lg font-semibold transition-colors"
                >
                  {t.close}
                </button>
                <button
                  onClick={confirmClearAllData}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {t.delete}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default SettingsModal;
