import React, { useContext, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Subject } from '../types';
import { SettingsContext } from '../context/SettingsContext';
import { TRANSLATIONS } from '../constants';

interface TimelineViewProps {
  subjects: Subject[];
  onEditSubject: (subject: Subject) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ subjects, onEditSubject }) => {
  const { language } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 7; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  const currentTimePosition = useMemo(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    if (hours < 7 || hours > 17) return null;
    return ((hours - 7) * 60 + minutes) / 60 * 80; // 80px per hour
  }, [currentTime]);

  const getSubjectPosition = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    return ((hours - 7) * 60 + minutes) / 60 * 80; // 80px per hour
  };

  const getSubjectHeight = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    return (durationMinutes / 60) * 80; // 80px per hour
  };

  const sortedSubjects = useMemo(() => {
    return [...subjects].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [subjects]);

  return (
    <div className="relative">
      {/* Timeline */}
      <div className="relative" style={{ height: `${11 * 80}px` }}>
        {/* Time labels */}
        <div className="absolute left-0 w-16 h-full">
          {timeSlots.map((time, index) => (
            <div
              key={time}
              className="absolute text-sm text-text-muted-light dark:text-text-muted-dark font-medium text-center w-full"
              style={{ top: `${index * 80}px` }}
            >
              {time}
            </div>
          ))}
        </div>

        {/* Grid lines */}
        <div className="absolute left-16 right-0 h-full">
          {timeSlots.map((time, index) => (
            <div
              key={time}
              className="absolute w-full border-t border-border-light dark:border-border-dark"
              style={{ top: `${index * 80}px` }}
            />
          ))}
        </div>

        {/* Current time indicator */}
        {currentTimePosition !== null && (
          <motion.div
            className="absolute left-16 right-0 h-0.5 bg-red-500 z-10"
            style={{ top: `${currentTimePosition}px` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -left-2 -top-1 w-4 h-4 bg-red-500 rounded-full" />
            <div className="absolute left-2 -top-3 text-xs text-red-500 font-semibold whitespace-nowrap">
              {t.currentTime}
            </div>
          </motion.div>
        )}

        {/* Subjects */}
        <div className="absolute left-20 right-4 h-full">
          {sortedSubjects.map((subject, index) => {
            const top = getSubjectPosition(subject.startTime);
            const height = getSubjectHeight(subject.startTime, subject.endTime);
            
            return (
              <motion.div
                key={subject.id}
                onClick={() => onEditSubject(subject)}
                className="absolute w-full px-3 py-2 rounded-lg cursor-pointer shadow-md overflow-hidden"
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  backgroundColor: subject.color,
                  minHeight: '60px'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.95, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ opacity: 1, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-white font-bold text-sm truncate">
                  {subject.name}
                </div>
                <div className="text-white text-xs opacity-90">
                  {subject.startTime} - {subject.endTime}
                </div>
                {subject.teacher && (
                  <div className="text-white text-xs opacity-90 truncate">
                    👨‍🏫 {subject.teacher}
                  </div>
                )}
                {subject.room && (
                  <div className="text-white text-xs opacity-90">
                    📍 {subject.room}
                  </div>
                )}
                {subject.notes && (
                  <div className="text-white text-xs opacity-90 truncate mt-1">
                    📝 {subject.notes}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;

