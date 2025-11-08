import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { SettingsContext } from '../context/SettingsContext';
import { DAYS_OF_WEEK, TRANSLATIONS } from '../constants';
import type { ViewMode } from '../types';
import { SettingsIcon } from './icons';
import SearchBar from './SearchBar';

interface HeaderProps {
  selectedDay: number | 'today';
  onSelectDay: (dayIndex: number | 'today') => void;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResultsCount?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  selectedDay, 
  onSelectDay, 
  onOpenSettings, 
  onOpenExport,
  viewMode, 
  onViewModeChange,
  searchQuery,
  onSearchChange,
  searchResultsCount
}) => {
  const { language, timetableTitle } = useContext(SettingsContext);
  const days = DAYS_OF_WEEK[language];
  const t = TRANSLATIONS[language];

  return (
    <header className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark">{timetableTitle}</h1>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onOpenExport}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={t.exportData}
          >
            📥
          </motion.button>
          <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar 
        value={searchQuery}
        onChange={onSearchChange}
        onClear={() => onSearchChange('')}
        resultsCount={searchResultsCount}
      />

      {/* View Mode Selector */}
      <div className="flex items-center space-x-2">
        <motion.button
          onClick={() => onViewModeChange('day')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            viewMode === 'day'
              ? 'bg-primary-light dark:bg-primary-dark text-white'
              : 'bg-card-light dark:bg-card-dark hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📱 {t.dayView}
        </motion.button>
        <motion.button
          onClick={() => onViewModeChange('week')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            viewMode === 'week'
              ? 'bg-primary-light dark:bg-primary-dark text-white'
              : 'bg-card-light dark:bg-card-dark hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📅 {t.weekView}
        </motion.button>
        <motion.button
          onClick={() => onViewModeChange('timeline')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            viewMode === 'timeline'
              ? 'bg-primary-light dark:bg-primary-dark text-white'
              : 'bg-card-light dark:bg-card-dark hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📊 {t.timelineView}
        </motion.button>
        <motion.button
          onClick={() => onViewModeChange('extras')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            viewMode === 'extras'
              ? 'bg-primary-light dark:bg-primary-dark text-white'
              : 'bg-card-light dark:bg-card-dark hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📚 {t.extrasView}
        </motion.button>
      </div>

      {/* Day Selector (only show for day/timeline views, hide for extras) */}
      {(viewMode === 'day' || viewMode === 'timeline') && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <motion.button
            onClick={() => onSelectDay('today')}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
              selectedDay === 'today'
                ? 'bg-primary-light dark:bg-primary-dark text-white'
                : 'bg-card-light dark:bg-card-dark hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.today}
          </motion.button>
          <div className="flex items-center space-x-2">
            {days.map((day, index) => (
              <motion.button
                key={index}
                onClick={() => onSelectDay(index)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                  selectedDay === index
                    ? 'bg-primary-light dark:bg-primary-dark text-white'
                    : 'bg-card-light dark:bg-card-dark hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {day}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
