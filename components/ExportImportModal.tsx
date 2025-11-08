import React, { useContext, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { SettingsContext } from '../context/SettingsContext';
import { useToast } from '../hooks/useToast';
import { TRANSLATIONS } from '../constants';
import type { Subject, ImportResult } from '../types';
import { exportToJSON } from '../utils/export';
import { parseJSON } from '../utils/import';
import { CloseIcon } from './icons';

interface ExportImportModalProps {
  onClose: () => void;
  subjects: Subject[];
  onImport: (result: ImportResult) => void;
}

const ExportImportModal: React.FC<ExportImportModalProps> = ({ onClose, subjects, onImport }) => {
  const { language, settings } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleExportJSON = async () => {
    try {
      await exportToJSON(subjects, settings);
      toast.success(language === 'vi' ? 'Vui lòng chọn nơi lưu file!' : 'Please choose where to save!');
    } catch (error) {
      console.error('[ExportImportModal] Export JSON error:', error);
      toast.error(error instanceof Error ? error.message : (language === 'vi' ? 'Lỗi khi xuất file' : 'Error exporting file'));
    }
  };

  // CSV export removed - only JSON supported

  const handleFileSelect = async (file: File) => {
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension !== 'json') {
        throw new Error(language === 'vi' ? 'Chỉ hỗ trợ file JSON!' : 'Only JSON files are supported!');
      }

      const result = await parseJSON(file);

      if (result.subjects.length === 0) {
        throw new Error(language === 'vi' ? 'File không chứa dữ liệu' : 'File contains no data');
      }

      console.log('[ExportImportModal] Importing:', {
        subjectsCount: result.subjects.length,
        hasSettings: !!result.settings
      });

      onImport(result);
      
      const settingsInfo = result.settings ? ` + ${language === 'vi' ? 'cài đặt' : 'settings'}` : '';
      toast.success(`${t.importSuccess} (${result.subjects.length} ${language === 'vi' ? 'môn học' : 'subjects'}${settingsInfo})`);
      onClose();
    } catch (error) {
      console.error('[ExportImportModal] Import error:', error);
      toast.error(error instanceof Error ? error.message : t.invalidFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
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
        className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t.exportData} / {t.importData}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Export Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark">
              📥 {t.exportData}
            </h3>
            <motion.button
              onClick={handleExportJSON}
              className="w-full px-4 py-3 bg-primary-light dark:bg-primary-dark text-white font-semibold rounded-lg text-left flex items-center justify-between"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{language === 'vi' ? 'Xuất file JSON' : 'Export JSON'}</span>
              <span className="text-sm opacity-80">.json</span>
            </motion.button>
          </div>

          {/* Import Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-text-light dark:text-text-dark">
              📤 {t.importData}
            </h3>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-primary-light dark:border-primary-dark bg-primary-light/10 dark:bg-primary-dark/10'
                  : 'border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark'
              }`}
            >
              <p className="text-text-muted-light dark:text-text-muted-dark mb-2">
                {t.dragDropFile}
              </p>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                {language === 'vi' ? 'Chỉ hỗ trợ file .json' : 'JSON files only'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>

          <p className="text-xs text-text-muted-light dark:text-text-muted-dark text-center">
            {language === 'vi' 
              ? '⚠️ Import sẽ thay thế toàn bộ dữ liệu hiện tại' 
              : '⚠️ Import will replace all current data'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExportImportModal;

