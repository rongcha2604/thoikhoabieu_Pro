import { useMemo } from 'react';
import type { Subject, SearchFilters } from '../types';

export const useSearch = (
  subjects: Subject[],
  query: string,
  filters: SearchFilters = {}
) => {
  const filteredSubjects = useMemo(() => {
    let results = [...subjects];

    // Apply search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase().trim();
      results = results.filter(subject => {
        const matchName = subject.name.toLowerCase().includes(lowerQuery);
        const matchTeacher = subject.teacher?.toLowerCase().includes(lowerQuery) || false;
        const matchRoom = subject.room?.toLowerCase().includes(lowerQuery) || false;
        const matchNotes = subject.notes?.toLowerCase().includes(lowerQuery) || false;
        
        return matchName || matchTeacher || matchRoom || matchNotes;
      });
    }

    // Apply day filter
    if (filters.day !== undefined) {
      results = results.filter(subject => subject.day === filters.day);
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(subject => 
        subject.tags?.some(tag => filters.tags!.includes(tag))
      );
    }

    // Apply hasTeacher filter
    if (filters.hasTeacher !== undefined) {
      results = results.filter(subject => 
        filters.hasTeacher ? !!subject.teacher : !subject.teacher
      );
    }

    // Apply hasRoom filter
    if (filters.hasRoom !== undefined) {
      results = results.filter(subject => 
        filters.hasRoom ? !!subject.room : !subject.room
      );
    }

    // Apply isExtraClass filter
    if (filters.isExtraClass !== undefined) {
      results = results.filter(subject => 
        filters.isExtraClass ? subject.isExtraClass === true : subject.isExtraClass !== true
      );
    }

    return results;
  }, [subjects, query, filters]);

  return {
    results: filteredSubjects,
    count: filteredSubjects.length,
    hasResults: filteredSubjects.length > 0,
    isEmpty: subjects.length === 0,
    isFiltered: query.trim() !== '' || Object.keys(filters).length > 0
  };
};

