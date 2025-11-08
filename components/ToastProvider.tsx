import React, { useContext, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { SettingsContext } from '../context/SettingsContext';

const ToastProvider: React.FC = () => {
  const { theme } = useContext(SettingsContext);

  useEffect(() => {
    // Update CSS variables for toast styling
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--toast-bg', '#334155');
      root.style.setProperty('--toast-color', '#e2e8f0');
    } else {
      root.style.setProperty('--toast-bg', '#ffffff');
      root.style.setProperty('--toast-color', '#1e293b');
    }
  }, [theme]);

  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: theme === 'dark' ? '#334155' : '#ffffff',
          color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
          borderRadius: '12px',
          padding: '12px 20px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: theme === 'dark' 
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
};

export default ToastProvider;

