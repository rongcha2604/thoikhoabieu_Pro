import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { SettingsContext } from '../context/SettingsContext';
import { TRANSLATIONS } from '../constants';
import type { EmptyStateType } from '../types';
import { MascotIcon } from './icons';

interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
  onSecondaryAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction, onSecondaryAction }) => {
  const { language } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];

  const configs = {
    'no-subjects': {
      title: language === 'vi' ? 'Chưa có môn học nào' : 'No subjects yet',
      description: language === 'vi' ? 'Thêm môn học đầu tiên của bạn để bắt đầu!' : 'Add your first subject to get started!',
      actionLabel: t.add_subject,
      secondaryActionLabel: t.importDataAction,
      emoji: '📚'
    },
    'no-results': {
      title: t.noResults,
      description: t.tryDifferentKeywords,
      actionLabel: t.clearSearch,
      emoji: '🔍'
    },
    'no-classes-today': {
      title: t.no_classes_today,
      description: language === 'vi' ? 'Hãy thư giãn và tận hưởng ngày nghỉ!' : 'Relax and enjoy your day off!',
      actionLabel: t.add_subject,
      emoji: '😊'
    },
    'error': {
      title: language === 'vi' ? 'Có lỗi xảy ra' : 'Something went wrong',
      description: language === 'vi' ? 'Vui lòng thử lại sau' : 'Please try again later',
      emoji: '⚠️'
    }
  };

  const config = configs[type];

  return (
    <motion.div
      className="text-center py-16 px-6 bg-card-light dark:bg-card-dark rounded-xl shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="mb-4"
      >
        <MascotIcon className="mx-auto h-24 w-24 text-primary-light dark:text-primary-dark opacity-80" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
          {config.emoji} {config.title}
        </h3>
        <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
          {config.description}
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {onAction && config.actionLabel && (
          <motion.button
            onClick={onAction}
            className="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white font-semibold rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {config.actionLabel}
          </motion.button>
        )}
        {onSecondaryAction && config.secondaryActionLabel && (
          <motion.button
            onClick={onSecondaryAction}
            className="px-6 py-3 bg-card-light dark:bg-card-dark border-2 border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark font-semibold rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {config.secondaryActionLabel}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;

