import React, { useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsContext } from '../context/SettingsContext';
import { useHomework } from '../hooks/useHomework';
import { useToast } from '../hooks/useToast';
import { TRANSLATIONS } from '../constants';
import type { Homework, Subject } from '../types';
import { CloseIcon, DeleteIcon } from './icons';

interface HomeworkManagerProps {
  subjects: Subject[];
  onClose: () => void;
}

const HomeworkManager: React.FC<HomeworkManagerProps> = ({ subjects, onClose }) => {
  const { language } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];
  const toast = useToast();
  const { homework, addHomework, updateHomework, deleteHomework, toggleComplete } = useHomework();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: subjects[0]?.id || '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium' as 'high' | 'medium' | 'low',
  });

  const sortedHomework = useMemo(() => {
    return [...homework].sort((a, b) => {
      // Incomplete first
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // Then by due date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [homework]);

  const isOverdue = (dueDate: string, completed: boolean) => {
    if (completed) return false;
    return new Date(dueDate) < new Date();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = subjects.find(s => s.id === formData.subjectId);
    if (!subject) return;

    if (editingId) {
      await updateHomework(editingId, {
        ...formData,
        subjectName: subject.name,
      });
      toast.success(language === 'vi' ? 'Đã cập nhật bài tập!' : 'Homework updated!');
      setEditingId(null);
    } else {
      await addHomework({
        id: Date.now().toString(),
        ...formData,
        subjectName: subject.name,
        completed: false,
        createdAt: new Date().toISOString(),
      });
      toast.success(language === 'vi' ? 'Đã thêm bài tập!' : 'Homework added!');
    }

    setIsAdding(false);
    setFormData({
      title: '',
      description: '',
      subjectId: subjects[0]?.id || '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
    });
  };

  const handleEdit = (hw: Homework) => {
    setFormData({
      title: hw.title,
      description: hw.description || '',
      subjectId: hw.subjectId,
      dueDate: hw.dueDate,
      priority: hw.priority,
    });
    setEditingId(hw.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(language === 'vi' ? 'Xóa bài tập này?' : 'Delete this homework?')) {
      await deleteHomework(id);
      toast.success(language === 'vi' ? 'Đã xóa bài tập!' : 'Homework deleted!');
    }
  };

  const priorityColors = {
    high: 'text-red-500 dark:text-red-400',
    medium: 'text-yellow-500 dark:text-yellow-400',
    low: 'text-green-500 dark:text-green-400',
  };

  const priorityIcons = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">📝 {t.homework}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Add Button */}
        {!isAdding && (
          <motion.button
            onClick={() => setIsAdding(true)}
            className="w-full mb-4 px-4 py-3 bg-primary-light dark:bg-primary-dark text-white font-semibold rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            + {t.addHomework}
          </motion.button>
        )}

        {/* Add/Edit Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              onSubmit={handleSubmit}
              className="mb-6 p-4 bg-background-light dark:bg-slate-700 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <input
                type="text"
                placeholder={t.homeworkTitle}
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full mb-3 p-2 bg-card-light dark:bg-slate-600 border border-border-light dark:border-border-dark rounded-lg"
              />
              
              <textarea
                placeholder={t.notes}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full mb-3 p-2 bg-card-light dark:bg-slate-600 border border-border-light dark:border-border-dark rounded-lg resize-none"
              />

              <div className="grid grid-cols-2 gap-3 mb-3">
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData(prev => ({ ...prev, subjectId: e.target.value }))}
                  className="p-2 bg-card-light dark:bg-slate-600 border border-border-light dark:border-border-dark rounded-lg"
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="p-2 bg-card-light dark:bg-slate-600 border border-border-light dark:border-border-dark rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">{t.priority}:</span>
                {(['high', 'medium', 'low'] as const).map(priority => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority }))}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      formData.priority === priority
                        ? 'bg-primary-light dark:bg-primary-dark text-white'
                        : 'bg-card-light dark:bg-slate-600'
                    }`}
                  >
                    {priorityIcons[priority]} {t[priority]}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white font-semibold rounded-lg"
                >
                  {editingId ? t.save : t.add_subject}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 bg-card-light dark:bg-slate-600 rounded-lg"
                >
                  {t.close}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Homework List */}
        <div className="space-y-3">
          {sortedHomework.length === 0 ? (
            <div className="text-center py-12 text-text-muted-light dark:text-text-muted-dark">
              {language === 'vi' ? 'Chưa có bài tập nào' : 'No homework yet'}
            </div>
          ) : (
            sortedHomework.map(hw => (
              <motion.div
                key={hw.id}
                className={`p-4 rounded-lg border-2 ${
                  hw.completed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : isOverdue(hw.dueDate, hw.completed)
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-card-light dark:bg-slate-700 border-border-light dark:border-border-dark'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={hw.completed}
                    onChange={() => toggleComplete(hw.id)}
                    className="mt-1 w-5 h-5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <h3 className={`font-semibold ${hw.completed ? 'line-through opacity-60' : ''}`}>
                      {hw.title}
                    </h3>
                    {hw.description && (
                      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                        {hw.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="text-primary-light dark:text-primary-dark font-medium">
                        {hw.subjectName}
                      </span>
                      <span className="text-text-muted-light dark:text-text-muted-dark">
                        📅 {new Date(hw.dueDate).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
                      </span>
                      <span className={priorityColors[hw.priority]}>
                        {priorityIcons[hw.priority]} {t[hw.priority]}
                      </span>
                      {isOverdue(hw.dueDate, hw.completed) && (
                        <span className="text-red-500 font-semibold">
                          {t.overdue}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(hw)}
                      className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(hw.id)}
                      className="p-2 hover:bg-red-500/10 rounded text-red-500"
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomeworkManager;

