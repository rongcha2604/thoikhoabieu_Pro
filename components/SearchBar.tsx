import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SettingsContext } from '../context/SettingsContext';
import { TRANSLATIONS } from '../constants';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  resultsCount?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onClear, resultsCount }) => {
  const { language } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <motion.div
        className={`flex items-center bg-card-light dark:bg-card-dark rounded-lg border-2 transition-colors ${
          isFocused
            ? 'border-primary-light dark:border-primary-dark'
            : 'border-transparent'
        }`}
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <span className="pl-3 text-text-muted-light dark:text-text-muted-dark">🔍</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t.searchPlaceholder}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark outline-none"
        />
        {value && (
          <motion.button
            onClick={onClear}
            className="pr-3 text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        )}
      </motion.div>

      {/* Results count */}
      {value && resultsCount !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 top-full mt-1 text-xs text-text-muted-light dark:text-text-muted-dark"
        >
          {resultsCount} {t.resultsFound}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;

