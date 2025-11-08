
import React, { useContext, useMemo } from 'react';
import type { Subject } from '../types';
import Timetable from './Timetable';
import { SettingsContext } from '../context/SettingsContext';
import { TRANSLATIONS, MOTIVATIONAL_QUOTES, DAYS_OF_WEEK } from '../constants';
import { MascotIcon } from './icons';

interface TodayViewProps {
  subjects: Subject[];
  onEditSubject: (subject: Subject) => void;
  dayIndex: number;
}

const TodayView: React.FC<TodayViewProps> = ({ subjects, onEditSubject, dayIndex }) => {
  const { language } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];

  const today = new Date();
  const dateString = today.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const quote = useMemo(() => {
    const quotes = MOTIVATIONAL_QUOTES[language];
    return quotes[today.getDate() % quotes.length];
  }, [language, today]);
  
  const dayName = DAYS_OF_WEEK[language][dayIndex] || '';

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card-light dark:bg-card-dark rounded-xl shadow-sm text-center">
         <h2 className="text-xl font-bold text-primary-light dark:text-primary-dark">{dayName}</h2>
        <p className="text-text-muted-light dark:text-text-muted-dark">{dateString}</p>
        <p className="mt-4 text-lg italic text-text-light dark:text-text-dark">"{quote}"</p>
        <p className="text-sm mt-1 text-text-muted-light dark:text-text-muted-dark">- {t.quote_of_the_day} -</p>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4">{t.upcoming_classes}</h3>
        {subjects.length > 0 ? (
            <Timetable subjects={subjects} onEditSubject={onEditSubject} dayIndex={dayIndex}/>
        ) : (
            <div className="text-center py-20 px-6 bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
                <MascotIcon className="mx-auto h-24 w-24 text-primary-light dark:text-primary-dark opacity-80" />
                <p className="mt-4 text-lg font-medium text-text-muted-light dark:text-text-muted-dark">
                {t.no_classes_today}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TodayView;
