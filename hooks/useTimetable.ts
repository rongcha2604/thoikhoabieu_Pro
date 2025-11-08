
import { useLocalStorage } from './useLocalStorage';
import { syncWithWidget } from '../utils/widgetSync';
import type { Subject } from '../types';

export const useTimetable = (initialSubjects: Subject[] = []) => {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('timetable_subjects', initialSubjects);

  // Helper để sync với widget sau mỗi thay đổi
  const syncSubjects = (updatedSubjects: Subject[]) => {
    syncWithWidget(updatedSubjects).catch(error => {
      console.error('Failed to sync with widget:', error);
    });
  };

  const addSubject = (subject: Subject) => {
    setSubjects(prev => {
      const updated = [...prev, subject];
      syncSubjects(updated);
      return updated;
    });
  };

  const updateSubject = (id: string, updatedSubject: Subject) => {
    setSubjects(prev => {
      const updated = prev.map(s => (s.id === id ? updatedSubject : s));
      syncSubjects(updated);
      return updated;
    });
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => {
      const updated = prev.filter(s => s.id !== id);
      syncSubjects(updated);
      return updated;
    });
  };

  // Sync toàn bộ subjects (dùng khi import hoặc load initial)
  const syncAllSubjects = () => {
    syncSubjects(subjects);
  };

  return { subjects, setSubjects, addSubject, updateSubject, deleteSubject, syncAllSubjects };
};
