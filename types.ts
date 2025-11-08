export type Language = 'en' | 'vi';
export type Theme = 'light' | 'dark';

export interface Subject {
  id: string;
  name: string;
  color: string;
  teacher?: string;
  room?: string;
  notes?: string;      // Ghi chú (Mang SGK, Kiểm tra, etc.)
  tags?: string[];     // Tags for categorization
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
  day: number; // 0 for Monday, 1 for Tuesday, ..., 5 for Saturday
  isExtraClass?: boolean; // true nếu là môn học thêm
}

export type ViewMode = 'day' | 'week' | 'timeline' | 'extras';

export interface SearchFilters {
  day?: number;
  tags?: string[];
  hasTeacher?: boolean;
  hasRoom?: boolean;
  isExtraClass?: boolean; // Filter riêng cho học thêm
}

export interface ExportData {
  version: string;
  exportDate: string;
  subjects: Subject[];
  settings?: Settings;
}

export interface ImportResult {
  subjects: Subject[];
  settings?: Settings;
}

export type EmptyStateType = 'no-subjects' | 'no-results' | 'no-classes-today' | 'error';

export interface Homework {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description?: string;
  dueDate: string; // ISO date string
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
}

export interface StudySession {
  id: string;
  subjectId?: string;
  duration: number; // minutes
  startTime: string;
  endTime: string;
  type: 'work' | 'break';
  date: string; // ISO date string
}

export interface Stats {
  totalHours: number;
  subjectDistribution: Record<string, number>;
  weeklyHours: number[];
  streakDays: number;
  totalSessions: number;
  extraClassCount: number; // Số môn học thêm
  extraClassHours: number; // Tổng thời gian học thêm (giờ)
  officialHours: number; // Tổng thời gian học chính thức (giờ)
}

export interface Period {
  period: number;
  startTime: string;
  endTime: string;
}

export interface Settings {
  theme: Theme;
  language: Language;
  notifications: boolean;
  classPeriods: {
    morning: Period[];
    afternoon: Period[];
  };
  timetableTitle: string;
}
