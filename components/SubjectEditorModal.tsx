
import React, { useState, useContext, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Subject } from '../types';
import { SettingsContext } from '../context/SettingsContext';
import { TRANSLATIONS, DAYS_OF_WEEK, SUBJECT_COLORS, CLASS_PERIODS } from '../constants';
import { CloseIcon, DeleteIcon, ChevronDownIcon } from './icons';

interface SubjectEditorModalProps {
  subject: Subject | null;
  onClose: () => void;
  onSave: (subject: Subject) => void;
  onDelete: (id: string) => void;
  initialDay: number;
  allSubjectNames: string[];
}

const SubjectEditorModal: React.FC<SubjectEditorModalProps> = ({ subject, onClose, onSave, onDelete, initialDay, allSubjectNames }) => {
  console.log('[SubjectEditorModal] Component rendered', { subject, initialDay });
  
  const { language, settings } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];
  const days = DAYS_OF_WEEK[language];
  const { classPeriods } = settings;
  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  const initialPeriod = classPeriods.morning[0] || CLASS_PERIODS.morning[0];
  
  const [formData, setFormData] = useState({
    name: subject?.name || '',
    startTime: subject?.startTime || initialPeriod.startTime,
    endTime: subject?.endTime || initialPeriod.endTime,
    day: subject?.day ?? (initialDay < 6 ? initialDay : 0),
    color: subject?.color || SUBJECT_COLORS[0],
    teacher: subject?.teacher || '',
    room: subject?.room || '',
    notes: subject?.notes || '',
    tags: subject?.tags || [],
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update formData when subject changes
  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        startTime: subject.startTime,
        endTime: subject.endTime,
        day: subject.day,
        color: subject.color,
        teacher: subject.teacher || '',
        room: subject.room || '',
        notes: subject.notes || '',
        tags: subject.tags || [],
      });
    } else {
      // Reset form for new subject
      const initialPeriod = classPeriods.morning[0] || CLASS_PERIODS.morning[0];
      setFormData({
        name: '',
        startTime: initialPeriod.startTime,
        endTime: initialPeriod.endTime,
        day: initialDay < 6 ? initialDay : 0,
        color: SUBJECT_COLORS[0],
        teacher: '',
        room: '',
        notes: '',
        tags: [],
      });
    }
  }, [subject, initialDay, classPeriods]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [suggestionBoxRef]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'day' ? parseInt(value) : value }));
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, name: value }));

    if (value) {
      const filtered = allSubjectNames.filter(name => name.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (name: string) => {
    setFormData(prev => ({...prev, name}));
    setShowSuggestions(false);
  };
  
  const handleDropdownClick = () => {
    if (showSuggestions) {
      setShowSuggestions(false);
    } else {
      setSuggestions(allSubjectNames);
      setShowSuggestions(true);
    }
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [startTime, endTime] = e.target.value.split('-');
    setFormData(prev => ({ ...prev, startTime, endTime }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSave = () => {
    onSave({ 
      id: subject?.id || '', 
      ...formData,
      isExtraClass: false, // Form môn học chính thức luôn set isExtraClass = false
    });
  };
  
  const handleDelete = () => {
    if (subject) {
      onDelete(subject.id);
    }
  };

  console.log('[SubjectEditorModal] Rendering modal');
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[120] p-4" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl w-full max-w-md p-6" 
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{subject ? t.edit_subject : t.add_subject}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <div ref={suggestionBoxRef}>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">{t.subject_name}</label>
            <div className="relative mt-1">
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleNameChange}
                required 
                className="block w-full bg-background-light dark:bg-slate-700 border-border-light dark:border-border-dark rounded-md shadow-sm p-2 pr-10" 
                autoComplete="off"
              />
               <button 
                type="button" 
                onClick={handleDropdownClick} 
                className="absolute inset-y-0 right-0 flex items-center px-2 text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark"
                aria-label="Show subject list"
              >
                <ChevronDownIcon className="w-5 h-5" />
              </button>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-card-light dark:bg-slate-800 border border-border-light dark:border-border-dark rounded-md shadow-lg mt-1 max-h-40 overflow-auto">
                  {suggestions.map((name, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(name)} className="px-3 py-2 cursor-pointer hover:bg-background-light dark:hover:bg-slate-700">
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">{t.day_of_week}</label>
            <select name="day" value={formData.day} onChange={handleChange} className="mt-1 block w-full bg-background-light dark:bg-slate-700 border-border-light dark:border-border-dark rounded-md shadow-sm p-2">
              {days.map((day, index) => <option key={index} value={index}>{day}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">{t.period}</label>
            <select 
                name="period" 
                value={`${formData.startTime}-${formData.endTime}`} 
                onChange={handlePeriodChange} 
                className="mt-1 block w-full bg-background-light dark:bg-slate-700 border-border-light dark:border-border-dark rounded-md shadow-sm p-2">
              <optgroup label={t.morning}>
                {classPeriods.morning.map(p => (
                  <option key={`m-${p.period}`} value={`${p.startTime}-${p.endTime}`}>{t.period} {p.period} ({p.startTime} - {p.endTime})</option>
                ))}
              </optgroup>
              <optgroup label={t.afternoon}>
                {classPeriods.afternoon.map(p => (
                  <option key={`a-${p.period}`} value={`${p.startTime}-${p.endTime}`}>{t.period} {p.period} ({p.startTime} - {p.endTime})</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">{t.color}</label>
             <div className="mt-2 grid grid-cols-8 gap-2">
                {SUBJECT_COLORS.map(color => (
                    <button key={color} type="button" onClick={() => setFormData(prev => ({...prev, color}))} className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${formData.color === color ? 'ring-2 ring-offset-2 ring-primary-light dark:ring-primary-dark ring-offset-card-light dark:ring-offset-card-dark' : ''}`} style={{ backgroundColor: color }}></button>
                ))}
             </div>
          </div>

          {/* Teacher */}
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">{t.teacher}</label>
            <input 
              type="text" 
              name="teacher"
              value={formData.teacher} 
              onChange={handleTextChange}
              placeholder={t.noTeacher}
              className="mt-1 block w-full bg-background-light dark:bg-slate-700 border-border-light dark:border-border-dark rounded-md shadow-sm p-2" 
            />
          </div>

          {/* Room */}
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">{t.room}</label>
            <input 
              type="text" 
              name="room"
              value={formData.room} 
              onChange={handleTextChange}
              placeholder={t.noRoom}
              className="mt-1 block w-full bg-background-light dark:bg-slate-700 border-border-light dark:border-border-dark rounded-md shadow-sm p-2" 
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">{t.notes}</label>
            <textarea 
              name="notes"
              value={formData.notes} 
              onChange={handleTextChange}
              placeholder={t.quickNotes}
              rows={2}
              className="mt-1 block w-full bg-background-light dark:bg-slate-700 border-border-light dark:border-border-dark rounded-md shadow-sm p-2 resize-none" 
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">{t.tags}</label>
            <input 
              type="text" 
              onKeyDown={handleTagInput}
              placeholder={t.addTag + " (Enter)"}
              className="mt-1 block w-full bg-background-light dark:bg-slate-700 border-border-light dark:border-border-dark rounded-md shadow-sm p-2" 
            />
            {formData.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4">
            {subject && (
              <button type="button" onClick={handleDelete} className="text-red-500 p-2 rounded-lg hover:bg-red-500/10">
                <DeleteIcon className="w-6 h-6"/>
              </button>
            )}
             <div className="flex-grow"></div>
            <button type="submit" className="px-6 py-2 bg-primary-light dark:bg-primary-dark text-white font-semibold rounded-lg shadow-sm hover:opacity-90">{t.save}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SubjectEditorModal;