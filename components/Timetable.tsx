import React, { useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Subject } from '../types';
import ClassCard from './ClassCard';
import { SettingsContext } from '../context/SettingsContext';
import { TRANSLATIONS } from '../constants';
import { MascotIcon } from './icons';

interface TimetableProps {
  subjects: Subject[];
  onEditSubject: (subject: Subject) => void;
  dayIndex: number;
}

const getPeriodInfo = (startTime: string): { session: 'morning' | 'afternoon' } | null => {
    const [hour] = startTime.split(':').map(Number);
    if (hour < 12) {
      return { session: 'morning' };
    } else if (hour >= 12) {
      return { session: 'afternoon' };
    }
    return null;
};

const Timetable: React.FC<TimetableProps> = ({ subjects, onEditSubject }) => {
  const { language } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];

  const morningSubjects = useMemo(() => 
    subjects.filter(s => getPeriodInfo(s.startTime)?.session === 'morning'), 
  [subjects]);

  const afternoonSubjects = useMemo(() => 
    subjects.filter(s => getPeriodInfo(s.startTime)?.session === 'afternoon'), 
  [subjects]);

  if (subjects.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
        <MascotIcon className="mx-auto h-24 w-24 text-primary-light dark:text-primary-dark opacity-80" />
        <p className="mt-4 text-lg font-medium text-text-muted-light dark:text-text-muted-dark">
          {t.no_classes_this_day}
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-6">
      {morningSubjects.length > 0 && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <h3 className="text-lg font-bold mb-3 text-text-muted-light dark:text-text-muted-dark px-2">{t.morning}</h3>
          <div className="space-y-3">
            {morningSubjects.map((subject, index) => (
              <ClassCard key={subject.id} subject={subject} onEdit={onEditSubject} period={index + 1} />
            ))}
          </div>
        </motion.div>
      )}

      {afternoonSubjects.length > 0 && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <h3 className="text-lg font-bold mb-3 text-text-muted-light dark:text-text-muted-dark px-2">{t.afternoon}</h3>
          <div className="space-y-3">
            {afternoonSubjects.map((subject, index) => (
              <ClassCard key={subject.id} subject={subject} onEdit={onEditSubject} period={index + 1} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Timetable;
