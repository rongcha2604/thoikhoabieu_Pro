
import React, { useState, useMemo, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimetable } from './hooks/useTimetable';
import { useSearch } from './hooks/useSearch';
import { SettingsContext } from './context/SettingsContext';
import { useToast } from './hooks/useToast';
import Header from './components/Header';
import Timetable from './components/Timetable';
import TodayView from './components/TodayView';
import WeekView from './components/WeekView';
import TimelineView from './components/TimelineView';
import ExtraClassesView from './components/ExtraClassesView';
import SettingsModal from './components/SettingsModal';
import SubjectEditorModal from './components/SubjectEditorModal';
import ExtraClassEditorModal from './components/ExtraClassEditorModal';
import SubjectEditorModalWithTabs from './components/SubjectEditorModalWithTabs';
import ExportImportModal from './components/ExportImportModal';
import EmptyState from './components/EmptyState';
import StatsDashboard from './components/StatsDashboard';
import HomeworkManager from './components/HomeworkManager';
import StudyTimer from './components/StudyTimer';
import ToastProvider from './components/ToastProvider';
import type { Subject, ViewMode, ImportResult } from './types';
import { DUMMY_SUBJECTS, VIETNAM_GRADE_8_SUBJECTS } from './constants';
// DUMMY_SUBJECTS chỉ dùng để restore khi cần, không dùng làm default
import { FloatingActionButton } from './components/icons';

const App: React.FC = () => {
  // Database mặc định là trống, không có dữ liệu mẫu
  const { subjects, addSubject, updateSubject, deleteSubject, setSubjects, syncAllSubjects } = useTimetable([]);
  const { language, updateSettings } = useContext(SettingsContext);
  const toast = useToast();

  // Sync with Android widget on mount and when subjects change
  useEffect(() => {
    syncAllSubjects();
  }, [subjects]);
  
  const today = useMemo(() => new Date().getDay(), []); // 0 for Sunday, 1 for Monday, etc.
  // Adjust so Monday is 0, Tuesday is 1... Saturday is 5
  const initialDayIndex = today === 0 ? 6 : today -1; 
  const [selectedDay, setSelectedDay] = useState<number | 'today'>(initialDayIndex >= 6 ? 'today' : initialDayIndex);
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [searchQuery, setSearchQuery] = useState('');

  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isExportOpen, setExportOpen] = useState(false);
  const [isStatsOpen, setStatsOpen] = useState(false);
  const [isHomeworkOpen, setHomeworkOpen] = useState(false);
  const [isTimerOpen, setTimerOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null | 'new'>(null);
  const [editingExtraClass, setEditingExtraClass] = useState<Subject | null | 'new'>(null);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  // Debug: Log state changes
  useEffect(() => {
    console.log('[App] editingSubject state:', editingSubject);
    if (editingSubject) {
      console.log('[App] ✅ SubjectEditorModal should be visible now');
    }
  }, [editingSubject]);

  useEffect(() => {
    console.log('[App] editingExtraClass state:', editingExtraClass);
    if (editingExtraClass) {
      console.log('[App] ✅ ExtraClassEditorModal should be visible now');
    }
  }, [editingExtraClass]);

  // Search & Filter - Context-aware filter cho học thêm
  const searchFilters = useMemo(() => {
    if (viewMode === 'extras') {
      return { isExtraClass: true };
    }
    return {};
  }, [viewMode]);

  const { results: searchResults, count: searchCount, isEmpty, isFiltered } = useSearch(subjects, searchQuery, searchFilters);
  
  const handleSelectDay = (dayIndex: number | 'today') => {
    setSelectedDay(dayIndex);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleImport = (result: ImportResult) => {
    console.log('[App] ========== IMPORT START ==========');
    console.log('[App] Importing data:', {
      subjectsCount: result.subjects.length,
      hasSettings: !!result.settings,
      settingsDetail: result.settings ? {
        theme: result.settings.theme,
        language: result.settings.language,
        timetableTitle: result.settings.timetableTitle,
        notif: result.settings.notifications,
        hasMorning: result.settings.classPeriods?.morning?.length,
        hasAfternoon: result.settings.classPeriods?.afternoon?.length
      } : null
    });
    
    // Restore subjects
    console.log('[App] Setting subjects...');
    setSubjects(result.subjects);
    console.log('[App] Subjects set complete');
    
    // Sync with widget after import
    syncAllSubjects();
    
    // Restore settings if present
    if (result.settings) {
      console.log('[App] Calling updateSettings with:', result.settings);
      
      // Update settings và force reload để persist
      updateSettings(result.settings);
      
      // Delay nhỏ để settings được lưu vào localStorage trước
      setTimeout(() => {
        console.log('[App] Settings updated, reloading app...');
        // Force reload app để settings được apply đúng
        window.location.reload();
      }, 300);
      
      toast.success(language === 'vi' 
        ? 'Đã khôi phục dữ liệu và cài đặt! Đang reload...' 
        : 'Data and settings restored! Reloading...'
      );
    } else {
      console.log('[App] WARNING: No settings in import result!');
      toast.success(language === 'vi' 
        ? 'Đã khôi phục dữ liệu!' 
        : 'Data restored!'
      );
    }
    console.log('[App] ========== IMPORT END ==========');
  };

  const handleSaveSubject = (subject: Subject) => {
    if (subject.id) {
      updateSubject(subject.id, subject);
      toast.success(toast.messages.subjectUpdated);
    } else {
      addSubject({ ...subject, id: Date.now().toString() });
      toast.success(toast.messages.subjectAdded);
    }
    // Đóng modal đúng loại dựa trên isExtraClass
    if (subject.isExtraClass === true) {
      setEditingExtraClass(null);
    } else {
      setEditingSubject(null);
    }
    setIsAddSubjectModalOpen(false); // Đóng modal mới sau khi lưu
  };

  const handleDeleteSubject = (id: string) => {
    // Tìm subject để kiểm tra isExtraClass
    const subjectToDelete = subjects.find(s => s.id === id);
    
    deleteSubject(id);
    toast.success(toast.messages.subjectDeleted);
    
    // Đóng modal đúng loại dựa trên isExtraClass
    if (subjectToDelete?.isExtraClass === true) {
      setEditingExtraClass(null);
    } else {
      setEditingSubject(null);
    }
  };

  const subjectsForDay = useMemo(() => {
      const dayIndex = selectedDay === 'today' ? initialDayIndex : selectedDay;
      if(dayIndex > 5) return []; // Saturday is 5, Sunday is 6
      
      // Use search results if searching, otherwise use all subjects
      const subjectsToFilter = searchQuery ? searchResults : subjects;
      
      return subjectsToFilter
        .filter(s => s.day === dayIndex)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [subjects, searchResults, searchQuery, selectedDay, initialDayIndex]);

  const allSubjectNames = useMemo(() => {
    const userSubjectNames = subjects.map(s => s.name);
    // Combine predefined list with user's custom subjects, ensuring no duplicates
    const combinedNames = [...VIETNAM_GRADE_8_SUBJECTS, ...userSubjectNames];
    return [...new Set(combinedNames)];
  }, [subjects]);


  return (
    <>
      <ToastProvider />
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark transition-colors duration-300">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <Header 
            selectedDay={selectedDay} 
            onSelectDay={handleSelectDay} 
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenExport={() => setExportOpen(true)}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchResultsCount={searchQuery ? searchCount : undefined}
          />
          <AnimatePresence mode="wait">
            <motion.main 
              key={`${viewMode}-${selectedDay}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {/* Empty state khi chưa có subjects */}
              {isEmpty && !isFiltered ? (
                <EmptyState 
                  type="no-subjects"
                  onAction={() => setEditingSubject('new')}
                  onSecondaryAction={() => setExportOpen(true)}
                />
              ) : /* Empty state khi search không có kết quả */
              searchQuery && searchCount === 0 ? (
                <EmptyState 
                  type="no-results"
                  onAction={() => setSearchQuery('')}
                />
              ) : viewMode === 'week' ? (
                <WeekView 
                  subjects={searchQuery ? searchResults : subjects} 
                  onEditSubject={(subject) => setEditingSubject(subject)}
                />
              ) : viewMode === 'timeline' ? (
                subjectsForDay.length > 0 ? (
                  <TimelineView 
                    subjects={subjectsForDay} 
                    onEditSubject={(subject) => setEditingSubject(subject)}
                  />
                ) : (
                  <EmptyState 
                    type="no-classes-today"
                    onAction={() => setEditingSubject('new')}
                  />
                )
              ) : viewMode === 'extras' ? (
                <ExtraClassesView 
                  subjects={searchQuery ? searchResults : subjects} 
                  onEditSubject={(subject) => setEditingExtraClass(subject)}
                />
              ) : (
                <>
                  {selectedDay === 'today' ? (
                    <TodayView 
                      subjects={subjectsForDay} 
                      onEditSubject={(subject) => setEditingSubject(subject)}
                      dayIndex={initialDayIndex}
                    />
                  ) : (
                    <Timetable 
                      subjects={subjectsForDay} 
                      onEditSubject={(subject) => setEditingSubject(subject)}
                      dayIndex={selectedDay}
                    />
                  )}
                </>
              )}
            </motion.main>
          </AnimatePresence>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          {/* Quick Actions */}
          <motion.button
            onClick={() => setStatsOpen(true)}
            className="bg-purple-500 dark:bg-purple-600 text-white rounded-full p-3 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={language === 'vi' ? 'Thống kê' : 'Statistics'}
          >
            📊
          </motion.button>

          <motion.button
            onClick={() => setHomeworkOpen(true)}
            className="bg-green-500 dark:bg-green-600 text-white rounded-full p-3 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={language === 'vi' ? 'Bài tập' : 'Homework'}
          >
            📝
          </motion.button>

          <motion.button
            onClick={() => setTimerOpen(true)}
            className="bg-orange-500 dark:bg-orange-600 text-white rounded-full p-3 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={language === 'vi' ? 'Đồng hồ học' : 'Study Timer'}
          >
            ⏱️
          </motion.button>

          {/* FAB Button - Nhập môn học */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setIsAddSubjectModalOpen(true);
            }}
            className="bg-primary-light dark:bg-primary-dark text-white rounded-full p-4 shadow-lg cursor-pointer relative z-[100]"
            aria-label={language === 'vi' ? 'Nhập môn học' : 'Add Subject'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <FloatingActionButton />
          </motion.button>
        </div>


        <AnimatePresence>
          {isSettingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {isExportOpen && (
            <ExportImportModal
              onClose={() => setExportOpen(false)}
              subjects={subjects}
              onImport={handleImport}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isStatsOpen && (
            <StatsDashboard
              subjects={subjects}
              onClose={() => setStatsOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isHomeworkOpen && (
            <HomeworkManager
              subjects={subjects}
              onClose={() => setHomeworkOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTimerOpen && (
            <StudyTimer
              onClose={() => setTimerOpen(false)}
            />
          )}
        </AnimatePresence>
        
        {/* Subject Editor Modal with Tabs */}
        <AnimatePresence>
          {isAddSubjectModalOpen && (
            <SubjectEditorModalWithTabs
              key="subject-editor-tabs"
              subject={null}
              onClose={() => {
                console.log('[App] Closing SubjectEditorModalWithTabs');
                setIsAddSubjectModalOpen(false);
              }}
              onSave={handleSaveSubject}
              onDelete={handleDeleteSubject}
              initialDay={selectedDay === 'today' ? initialDayIndex : selectedDay}
              allSubjectNames={allSubjectNames}
            />
          )}
        </AnimatePresence>

        {/* Subject Editor Modal (for editing existing subjects) */}
        {editingSubject && (
          <AnimatePresence>
            <SubjectEditorModal
              key="subject-editor"
              subject={editingSubject === 'new' ? null : editingSubject}
              onClose={() => {
                console.log('[App] Closing SubjectEditorModal');
                setEditingSubject(null);
              }}
              onSave={handleSaveSubject}
              onDelete={handleDeleteSubject}
              initialDay={selectedDay === 'today' ? initialDayIndex : selectedDay}
              allSubjectNames={allSubjectNames}
            />
          </AnimatePresence>
        )}

        {/* Extra Class Editor Modal (for editing existing extra classes) */}
        {editingExtraClass && (
          <AnimatePresence>
            <ExtraClassEditorModal
              key="extra-class-editor"
              subject={editingExtraClass === 'new' ? null : editingExtraClass}
              onClose={() => {
                console.log('[App] Closing ExtraClassEditorModal');
                setEditingExtraClass(null);
              }}
              onSave={handleSaveSubject}
              onDelete={handleDeleteSubject}
              initialDay={selectedDay === 'today' ? initialDayIndex : selectedDay}
              allSubjectNames={allSubjectNames}
            />
          </AnimatePresence>
        )}
      </div>
    </>
  );
};

export default App;
