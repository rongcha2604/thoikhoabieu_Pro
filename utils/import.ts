import type { Subject, ExportData, ImportResult } from '../types';

export const parseJSON = async (file: File): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate data structure
        if (!validateJSONData(data)) {
          reject(new Error('Invalid JSON structure'));
          return;
        }

        // Return both subjects and settings
        const result: ImportResult = {
          subjects: data.subjects || data,
          settings: data.settings  // Include settings if present
        };
        
        console.log('[Import] Parsed data:', {
          subjectsCount: result.subjects.length,
          hasSettings: !!result.settings,
          timetableTitle: result.settings?.timetableTitle
        });

        resolve(result);
      } catch (error) {
        console.error('[Import] Parse error:', error);
        reject(new Error('Failed to parse JSON file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const parseCSV = async (file: File): Promise<Subject[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          reject(new Error('CSV file is empty'));
          return;
        }

        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        const subjects: Subject[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
          const subject: Subject = {
            id: Date.now().toString() + i,
            name: values[0] || '',
            day: parseInt(values[1]) || 0,
            startTime: values[2] || '08:00',
            endTime: values[3] || '09:00',
            teacher: values[4] || undefined,
            room: values[5] || undefined,
            notes: values[6] || undefined,
            tags: values[7] ? values[7].split(';').filter(t => t) : undefined,
            color: values[8] || '#3b82f6'
          };

          if (subject.name) {
            subjects.push(subject);
          }
        }

        resolve(subjects);
      } catch (error) {
        reject(new Error('Failed to parse CSV file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const validateJSONData = (data: any): boolean => {
  if (!data) return false;

  // Check if it's ExportData format
  if (data.subjects && Array.isArray(data.subjects)) {
    return validateSubjects(data.subjects);
  }

  // Check if it's direct Subject array
  if (Array.isArray(data)) {
    return validateSubjects(data);
  }

  return false;
};

const validateSubjects = (subjects: any[]): boolean => {
  if (!Array.isArray(subjects)) return false;
  
  return subjects.every(subject => 
    typeof subject.name === 'string' &&
    typeof subject.day === 'number' &&
    typeof subject.startTime === 'string' &&
    typeof subject.endTime === 'string' &&
    typeof subject.color === 'string'
  );
};

