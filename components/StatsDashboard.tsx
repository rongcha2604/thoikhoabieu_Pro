import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { SettingsContext } from '../context/SettingsContext';
import { useStats } from '../hooks/useStats';
import { TRANSLATIONS, DAYS_OF_WEEK } from '../constants';
import type { Subject } from '../types';
import { CloseIcon } from './icons';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface StatsDashboardProps {
  subjects: Subject[];
  onClose: () => void;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ subjects, onClose }) => {
  const { language, theme } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];
  const stats = useStats(subjects);
  const days = DAYS_OF_WEEK[language];

  const chartColors = theme === 'dark' 
    ? ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']
    : ['#fca5a5', '#fcd34d', '#6ee7b7', '#93c5fd', '#c4b5fd', '#f9a8d4', '#5eead4'];

  // Pie chart data - Subject distribution
  const pieData = {
    labels: Object.keys(stats.subjectDistribution),
    datasets: [{
      data: Object.values(stats.subjectDistribution),
      backgroundColor: chartColors,
      borderColor: theme === 'dark' ? '#334155' : '#ffffff',
      borderWidth: 2,
    }]
  };

  // Bar chart data - Weekly hours
  const barData = {
    labels: days,
    datasets: [{
      label: t.totalHours,
      data: stats.weeklyHours,
      backgroundColor: theme === 'dark' ? '#3b82f6' : '#60a5fa',
      borderColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#334155' : '#ffffff',
        titleColor: theme === 'dark' ? '#e2e8f0' : '#1e293b',
        bodyColor: theme === 'dark' ? '#e2e8f0' : '#1e293b',
        borderColor: theme === 'dark' ? '#475569' : '#e2e8f0',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b' },
        grid: { color: theme === 'dark' ? '#334155' : '#e2e8f0' }
      },
      x: {
        ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b' },
        grid: { display: false }
      }
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
        className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">📊 {t.statistics}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Thời gian học - 3 cards chính */}
          <motion.div
            className="bg-background-light dark:bg-slate-700 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {language === 'vi' ? 'Tổng thời gian học' : 'Total Study Hours'}
            </p>
            <p className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              {stats.totalHours.toFixed(1)}h
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
              {language === 'vi' ? 'Cả tuần' : 'Per week'}
            </p>
          </motion.div>

          <motion.div
            className="bg-background-light dark:bg-slate-700 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {language === 'vi' ? 'Thời gian học chính thức' : 'Official Class Hours'}
            </p>
            <p className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              {stats.officialHours.toFixed(1)}h
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
              {language === 'vi' ? 'Cả tuần' : 'Per week'}
            </p>
          </motion.div>

          <motion.div
            className="bg-background-light dark:bg-slate-700 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {language === 'vi' ? 'Thời gian học thêm' : 'Extra Class Hours'}
            </p>
            <p className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              {stats.extraClassHours.toFixed(1)}h
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
              {language === 'vi' ? 'Cả tuần' : 'Per week'}
            </p>
          </motion.div>
        </div>

        {/* Other Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            className="bg-background-light dark:bg-slate-700 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {language === 'vi' ? 'Số môn học' : 'Subjects'}
            </p>
            <p className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              {Object.keys(stats.subjectDistribution).length}
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
              {language === 'vi' ? 'Tổng số' : 'Total'}
            </p>
          </motion.div>

          <motion.div
            className="bg-background-light dark:bg-slate-700 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {language === 'vi' ? 'Số môn học thêm' : 'Extra Classes'}
            </p>
            <p className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              {stats.extraClassCount}
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
              {language === 'vi' ? 'Môn học thêm' : 'Extra classes'}
            </p>
          </motion.div>

          <motion.div
            className="bg-background-light dark:bg-slate-700 rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              {language === 'vi' ? 'Ngày có lịch' : 'Days with classes'}
            </p>
            <p className="text-3xl font-bold text-primary-light dark:text-primary-dark">
              {stats.streakDays}
            </p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
              {language === 'vi' ? 'Trong tuần' : 'In week'}
            </p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart - Subject Distribution */}
          {Object.keys(stats.subjectDistribution).length > 0 && (
            <div className="bg-background-light dark:bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'vi' ? 'Phân bổ môn học' : 'Subject Distribution'}
              </h3>
              <div style={{ height: '250px' }}>
                <Pie data={pieData} options={{ ...chartOptions, scales: undefined }} />
              </div>
            </div>
          )}

          {/* Bar Chart - Weekly Hours */}
          <div className="bg-background-light dark:bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'vi' ? 'Giờ học theo ngày' : 'Hours by Day'}
            </h3>
            <div style={{ height: '250px' }}>
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Subject List */}
        <div className="mt-6 bg-background-light dark:bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">
            {language === 'vi' ? 'Chi tiết môn học' : 'Subject Details'}
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.subjectDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([subject, hours]) => (
                <div key={subject} className="flex justify-between items-center py-2 border-b border-border-light dark:border-border-dark last:border-0">
                  <span className="font-medium">{subject}</span>
                  <span className="text-primary-light dark:text-primary-dark font-bold">
                    {hours.toFixed(1)}h
                  </span>
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsDashboard;

