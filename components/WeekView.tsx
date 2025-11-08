import React, { useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Subject } from '../types';
import { SettingsContext } from '../context/SettingsContext';
import { DAYS_OF_WEEK, TRANSLATIONS } from '../constants';

interface WeekViewProps {
  subjects: Subject[];
  onEditSubject: (subject: Subject) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ subjects, onEditSubject }) => {
  const { language } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];
  const days = DAYS_OF_WEEK[language];

  const subjectsByDay = useMemo(() => {
    const grouped: Subject[][] = [[], [], [], [], [], [], []];
    subjects.forEach(subject => {
      if (subject.day >= 0 && subject.day <= 6) {
        grouped[subject.day].push(subject);
      }
    });
    // Sort by start time
    grouped.forEach(daySubjects => {
      daySubjects.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return grouped;
  }, [subjects]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="overflow-x-auto pb-4"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <div className="min-w-max md:min-w-0">
        <div className="grid grid-cols-7 gap-3 md:gap-4">
          {/* Render 7 columns, mỗi column = header + subjects */}
          {days.map((day, dayIndex) => (
            <motion.div
              key={dayIndex}
              variants={itemVariants}
              className="flex flex-col"
            >
              {/* Header */}
              <div className="text-center font-bold text-sm md:text-base text-text-light dark:text-text-dark pb-2 mb-2 border-b-2 border-primary-light dark:border-primary-dark">
                {day}
              </div>

              {/* Subjects container */}
              <div className="space-y-2 min-h-[200px]">
                {subjectsByDay[dayIndex].length > 0 ? (
                  subjectsByDay[dayIndex].map(subject => (
                    <motion.div
                      key={subject.id}
                      onClick={() => onEditSubject(subject)}
                      className="p-2 rounded-lg cursor-pointer text-xs md:text-sm bg-card-light dark:bg-card-dark shadow-sm"
                      style={{ borderLeft: `4px solid ${subject.color}` }}
                      whileHover={{ scale: 1.03, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-semibold text-text-light dark:text-text-dark truncate">
                        {subject.name}
                      </div>
                      <div className="text-text-muted-light dark:text-text-muted-dark text-xs">
                        {subject.startTime}
                      </div>
                      {subject.teacher && (
                        <div className="text-text-muted-light dark:text-text-muted-dark text-xs truncate">
                          👨‍🏫 {subject.teacher}
                        </div>
                      )}
                      {subject.room && (
                        <div className="text-text-muted-light dark:text-text-muted-dark text-xs">
                          📍 {subject.room}
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-text-muted-light dark:text-text-muted-dark text-xs py-4 opacity-50">
                    -
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WeekView;

