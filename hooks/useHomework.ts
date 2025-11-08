import { useState, useEffect } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Homework } from '../types';

interface HomeworkDB extends DBSchema {
  homework: {
    key: string;
    value: Homework;
    indexes: { 'by-due-date': string; 'by-subject': string };
  };
}

let dbPromise: Promise<IDBPDatabase<HomeworkDB>> | null = null;

const getDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB<HomeworkDB>('timetable-homework', 1, {
      upgrade(db) {
        const store = db.createObjectStore('homework', { keyPath: 'id' });
        store.createIndex('by-due-date', 'dueDate');
        store.createIndex('by-subject', 'subjectId');
      },
    });
  }
  return dbPromise;
};

export const useHomework = () => {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);

  // Load homework from IndexedDB
  useEffect(() => {
    loadHomework();
  }, []);

  const loadHomework = async () => {
    try {
      const db = await getDB();
      const allHomework = await db.getAll('homework');
      setHomework(allHomework);
    } catch (error) {
      console.error('Failed to load homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHomework = async (hw: Homework) => {
    try {
      const db = await getDB();
      await db.add('homework', hw);
      setHomework(prev => [...prev, hw]);
    } catch (error) {
      console.error('Failed to add homework:', error);
    }
  };

  const updateHomework = async (id: string, updates: Partial<Homework>) => {
    try {
      const db = await getDB();
      const existing = await db.get('homework', id);
      if (existing) {
        const updated = { ...existing, ...updates };
        await db.put('homework', updated);
        setHomework(prev => prev.map(hw => hw.id === id ? updated : hw));
      }
    } catch (error) {
      console.error('Failed to update homework:', error);
    }
  };

  const deleteHomework = async (id: string) => {
    try {
      const db = await getDB();
      await db.delete('homework', id);
      setHomework(prev => prev.filter(hw => hw.id !== id));
    } catch (error) {
      console.error('Failed to delete homework:', error);
    }
  };

  const toggleComplete = async (id: string) => {
    const hw = homework.find(h => h.id === id);
    if (hw) {
      await updateHomework(id, { completed: !hw.completed });
    }
  };

  return {
    homework,
    loading,
    addHomework,
    updateHomework,
    deleteHomework,
    toggleComplete,
  };
};

