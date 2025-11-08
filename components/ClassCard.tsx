
import React, { useMemo, useContext } from 'react';
import { motion } from 'framer-motion';
import type { Subject } from '../types';
import { SUBJECT_ICONS, TRANSLATIONS } from '../constants';
import { SettingsContext } from '../context/SettingsContext';

interface ClassCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  period: number;
}

const ClassCard: React.FC<ClassCardProps> = ({ subject, onEdit, period }) => {
  const { theme, language } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];
  const { name, startTime, endTime, color, teacher, room, notes, tags } = subject;

  const IconComponent = useMemo(() => {
    const lowerCaseName = name.toLowerCase().trim();
    // Sort keys by length, descending, to match longer names first (e.g., "giáo dục công dân" before "văn")
    const iconKey = Object.keys(SUBJECT_ICONS)
      .sort((a, b) => b.length - a.length)
      .find(key => lowerCaseName.includes(key));
    return iconKey ? SUBJECT_ICONS[iconKey] : null;
  }, [name]);
  
  return (
    <motion.div
      onClick={() => onEdit(subject)}
      className="flex items-stretch p-3 rounded-xl shadow-sm cursor-pointer bg-card-light dark:bg-card-dark"
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        boxShadow: theme === 'dark' 
          ? '0 10px 20px -3px rgba(0, 0, 0, 0.5)' 
          : '0 10px 20px -3px rgba(0, 0, 0, 0.15)'
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div 
        className="w-16 flex-shrink-0 flex flex-col items-center justify-center rounded-lg text-white"
        style={{ backgroundColor: color }}
      >
        <span className="text-sm font-medium opacity-90">{t.period}</span>
        <span className="text-3xl font-bold">{period}</span>
      </div>

      <div className="flex-grow flex items-center pl-4">
         {IconComponent && (
          <div className="mr-4 flex-shrink-0">
             <div className="w-12 h-12 rounded-full flex items-center justify-center bg-background-light dark:bg-card-dark">
              <IconComponent className="w-7 h-7 text-text-light dark:text-text-dark opacity-80" style={{color}}/>
            </div>
          </div>
        )}
        <div className="flex-grow">
          <p className="font-bold text-lg text-text-light dark:text-text-dark">{name}</p>
          <p className="font-semibold text-sm text-text-muted-light dark:text-text-muted-dark">{startTime} - {endTime}</p>
          
          {/* Teacher & Room Info */}
          {(teacher || room) && (
            <div className="mt-1 space-y-0.5">
              {teacher && (
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark flex items-center">
                  <span className="mr-1">👨‍🏫</span>
                  {teacher}
                </p>
              )}
              {room && (
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark flex items-center">
                  <span className="mr-1">📍</span>
                  {room}
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          {notes && (
            <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark flex items-start">
              <span className="mr-1 flex-shrink-0">📝</span>
              <span className="line-clamp-2">{notes}</span>
            </p>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs rounded-full bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ClassCard;
