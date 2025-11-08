import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { SettingsContext } from '../context/SettingsContext';
import { TRANSLATIONS } from '../constants';
import { CloseIcon, LightModeIcon, DarkModeIcon } from './icons';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, setTheme, setLanguage, updateClassPeriods, language, timetableTitle, updateTimetableTitle } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];

  const handleTimeChange = (session: 'morning' | 'afternoon', index: number, field: 'startTime' | 'endTime', value: string) => {
    const newPeriods = JSON.parse(JSON.stringify(settings.classPeriods)); // Deep copy
    newPeriods[session][index][field] = value;
    updateClassPeriods(newPeriods);
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
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;
