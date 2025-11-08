import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsContext } from '../context/SettingsContext';
import { TRANSLATIONS } from '../constants';

interface StudyTimerProps {
  onClose?: () => void;
  isWidget?: boolean;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onClose, isWidget = false }) => {
  const { language } = useContext(SettingsContext);
  const t = TRANSLATIONS[language];

  const [workDuration, setWorkDuration] = useState(25); // minutes
  const [breakDuration, setBreakDuration] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(workDuration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Session complete - play sound and switch
      playAlertSound();
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const playAlertSound = () => {
    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleSessionComplete = () => {
    if (isWorkSession) {
      setSessionsCompleted(prev => prev + 1);
      setIsWorkSession(false);
      setTimeLeft(breakDuration * 60);
    } else {
      setIsWorkSession(true);
      setTimeLeft(workDuration * 60);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsWorkSession(true);
    setTimeLeft(workDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isWorkSession 
    ? ((workDuration * 60 - timeLeft) / (workDuration * 60)) * 100
    : ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100;

  const TimerContent = (
    <div className={`${isWidget ? 'p-4' : 'p-6'}`}>
      {!isWidget && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">⏱️ {t.studyTimer}</h2>
          {onClose && (
            <button onClick={onClose} className="text-2xl">×</button>
          )}
        </div>
      )}

      {/* Timer Display */}
      <div className="text-center mb-6">
        <motion.div
          className={`text-6xl font-bold mb-2 ${
            isWorkSession 
              ? 'text-primary-light dark:text-primary-dark' 
              : 'text-green-500 dark:text-green-400'
          }`}
          animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
        >
          {formatTime(timeLeft)}
        </motion.div>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
          {isWorkSession 
            ? (language === 'vi' ? '🔥 Làm việc' : '🔥 Work Session')
            : (language === 'vi' ? '☕ Nghỉ ngơi' : '☕ Break Time')}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-background-light dark:bg-slate-700 rounded-full h-3 mb-6">
        <motion.div
          className={`h-3 rounded-full ${
            isWorkSession 
              ? 'bg-primary-light dark:bg-primary-dark' 
              : 'bg-green-500 dark:bg-green-400'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-6">
        {!isRunning ? (
          <motion.button
            onClick={handleStart}
            className="px-6 py-3 bg-primary-light dark:bg-primary-dark text-white font-semibold rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ▶ {t.startTimer}
          </motion.button>
        ) : (
          <motion.button
            onClick={handlePause}
            className="px-6 py-3 bg-yellow-500 dark:bg-yellow-600 text-white font-semibold rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⏸ {t.pauseTimer}
          </motion.button>
        )}
        <motion.button
          onClick={handleReset}
          className="px-6 py-3 bg-card-light dark:bg-slate-700 border-2 border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark font-semibold rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⏹ {t.resetTimer}
        </motion.button>
      </div>

      {/* Sessions Info */}
      <div className="text-center mb-6">
        <p className="text-text-muted-light dark:text-text-muted-dark">
          {t.sessionsToday}: <span className="font-bold text-primary-light dark:text-primary-dark">
            {sessionsCompleted} 🍅
          </span>
        </p>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
          {t.focusTime}: {Math.floor(sessionsCompleted * workDuration / 60)}h {(sessionsCompleted * workDuration) % 60}m
        </p>
      </div>

      {/* Settings (only in modal, not widget) */}
      {!isWidget && !isRunning && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-light dark:border-border-dark">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.workDuration}
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={workDuration}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 25;
                setWorkDuration(val);
                if (isWorkSession) setTimeLeft(val * 60);
              }}
              className="w-full bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {t.breakDuration}
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 5;
                setBreakDuration(val);
                if (!isWorkSession) setTimeLeft(val * 60);
              }}
              className="w-full bg-background-light dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-lg p-2"
            />
          </div>
        </div>
      )}
    </div>
  );

  if (isWidget) {
    return (
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg">
        {TimerContent}
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {TimerContent}
      </motion.div>
    </motion.div>
  );
};

export default StudyTimer;

