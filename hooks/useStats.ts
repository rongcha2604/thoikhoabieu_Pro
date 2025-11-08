import { useMemo } from 'react';
import type { Subject, Stats, StudySession } from '../types';

export const useStats = (subjects: Subject[], sessions: StudySession[] = []): Stats => {
  return useMemo(() => {
    // Calculate total hours from subjects
    const totalMinutes = subjects.reduce((total, subject) => {
      const [startH, startM] = subject.startTime.split(':').map(Number);
      const [endH, endM] = subject.endTime.split(':').map(Number);
      const duration = (endH * 60 + endM) - (startH * 60 + startM);
      return total + duration;
    }, 0);

    // Subject distribution (hours per subject)
    const subjectDistribution: Record<string, number> = {};
    subjects.forEach(subject => {
      const [startH, startM] = subject.startTime.split(':').map(Number);
      const [endH, endM] = subject.endTime.split(':').map(Number);
      const hours = ((endH * 60 + endM) - (startH * 60 + startM)) / 60;
      
      subjectDistribution[subject.name] = (subjectDistribution[subject.name] || 0) + hours;
    });

    // Weekly hours (Monday to Sunday)
    const weeklyHours = [0, 0, 0, 0, 0, 0, 0];
    subjects.forEach(subject => {
      const [startH, startM] = subject.startTime.split(':').map(Number);
      const [endH, endM] = subject.endTime.split(':').map(Number);
      const hours = ((endH * 60 + endM) - (startH * 60 + startM)) / 60;
      
      if (subject.day >= 0 && subject.day <= 6) {
        weeklyHours[subject.day] += hours;
      }
    });

    // Study streak (simplified - count days with subjects)
    const daysWithSubjects = new Set(subjects.map(s => s.day)).size;

    // Calculate extra class statistics
    const extraClasses = subjects.filter(s => s.isExtraClass === true);
    const extraClassCount = extraClasses.length;
    
    // Calculate total hours for extra classes
    const extraClassMinutes = extraClasses.reduce((total, subject) => {
      const [startH, startM] = subject.startTime.split(':').map(Number);
      const [endH, endM] = subject.endTime.split(':').map(Number);
      const duration = (endH * 60 + endM) - (startH * 60 + startM);
      return total + duration;
    }, 0);
    const extraClassHours = extraClassMinutes / 60;

    // Calculate official class statistics (subjects that are NOT extra classes)
    const officialClasses = subjects.filter(s => s.isExtraClass !== true);
    
    // Calculate total hours for official classes
    const officialMinutes = officialClasses.reduce((total, subject) => {
      const [startH, startM] = subject.startTime.split(':').map(Number);
      const [endH, endM] = subject.endTime.split(':').map(Number);
      const duration = (endH * 60 + endM) - (startH * 60 + startM);
      return total + duration;
    }, 0);
    const officialHours = officialMinutes / 60;

    return {
      totalHours: totalMinutes / 60,
      subjectDistribution,
      weeklyHours,
      streakDays: daysWithSubjects,
      totalSessions: sessions.length,
      extraClassCount,
      extraClassHours,
      officialHours
    };
  }, [subjects, sessions]);
};

