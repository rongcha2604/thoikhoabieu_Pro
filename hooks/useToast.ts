import { useContext } from 'react';
import toast from 'react-hot-toast';
import { SettingsContext } from '../context/SettingsContext';

export const useToast = () => {
  const { language } = useContext(SettingsContext);

  const messages = {
    vi: {
      subjectAdded: 'Đã thêm môn học thành công!',
      subjectUpdated: 'Đã cập nhật môn học!',
      subjectDeleted: 'Đã xóa môn học!',
      confirmDelete: 'Bạn có chắc chắn muốn xóa?',
      error: 'Có lỗi xảy ra!',
      loading: 'Đang xử lý...',
    },
    en: {
      subjectAdded: 'Subject added successfully!',
      subjectUpdated: 'Subject updated!',
      subjectDeleted: 'Subject deleted!',
      confirmDelete: 'Are you sure you want to delete?',
      error: 'An error occurred!',
      loading: 'Processing...',
    },
  };

  const t = messages[language];

  return {
    success: (message: string) => toast.success(message, {
      duration: 3000,
      position: 'bottom-center',
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-color)',
        borderRadius: '12px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
    }),
    error: (message: string) => toast.error(message, {
      duration: 4000,
      position: 'bottom-center',
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-color)',
        borderRadius: '12px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
    }),
    loading: (message: string) => toast.loading(message, {
      position: 'bottom-center',
      style: {
        background: 'var(--toast-bg)',
        color: 'var(--toast-color)',
        borderRadius: '12px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
    }),
    messages: t,
  };
};

