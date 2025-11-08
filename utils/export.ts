import type { Subject, ExportData, Settings } from '../types';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * Export thời khóa biểu ra file JSON
 * Android: Share dialog - user tự chọn nơi lưu
 * Web: Download thông thường
 */
export const exportToJSON = async (subjects: Subject[], settings?: Settings): Promise<void> => {
  console.log('[Export] Starting export with:', {
    subjectsCount: subjects.length,
    hasSettings: !!settings,
    settingsContent: settings ? {
      theme: settings.theme,
      language: settings.language,
      timetableTitle: settings.timetableTitle,
      hasClassPeriods: !!settings.classPeriods
    } : null
  });

  const data: ExportData = {
    version: '1.0',
    exportDate: new Date().toISOString().split('T')[0],
    subjects,
    settings
  };

  const content = JSON.stringify(data, null, 2);
  const filename = `timetable-${data.exportDate}.json`;
  
  console.log('[Export] JSON length:', content.length, 'chars');
  console.log('[Export] First 200 chars:', content.substring(0, 200));

  if (Capacitor.isNativePlatform()) {
    // Android/iOS: Share API - user chọn nơi lưu
    console.log('[Export] Native platform detected, using Share API');
    await shareFile(content, filename, 'application/json');
  } else {
    // Web: Download bình thường
    console.log('[Export] Web platform detected, using blob download');
    const blob = new Blob([content], { type: 'application/json' });
    downloadFile(blob, filename);
  }
};

/**
 * Export thời khóa biểu ra file CSV
 * Android: Share dialog - user tự chọn nơi lưu
 * Web: Download thông thường
 */
export const exportToCSV = async (subjects: Subject[]): Promise<void> => {
  const headers = ['name', 'day', 'startTime', 'endTime', 'teacher', 'room', 'notes', 'tags', 'color'];
  const rows = subjects.map(subject => [
    subject.name,
    subject.day.toString(),
    subject.startTime,
    subject.endTime,
    subject.teacher || '',
    subject.room || '',
    subject.notes || '',
    subject.tags?.join(';') || '',
    subject.color
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const date = new Date().toISOString().split('T')[0];
  const filename = `timetable-${date}.csv`;

  if (Capacitor.isNativePlatform()) {
    // Android/iOS: Share API - user chọn nơi lưu
    console.log('[Export] Native platform detected, using Share API');
    await shareFile(csvContent, filename, 'text/csv');
  } else {
    // Web: Download bình thường
    console.log('[Export] Web platform detected, using blob download');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, filename);
  }
};

/**
 * Share file trên Android - User tự chọn nơi lưu
 * 1. Tạo file tạm trong Cache
 * 2. Mở Share dialog
 * 3. User chọn: Save to Files, Google Drive, Email, etc.
 */
const shareFile = async (content: string, filename: string, mimeType: string): Promise<void> => {
  try {
    console.log(`[Share] Starting share for file: ${filename}`);
    
    // Viết file vào Cache directory (temporary)
    const result = await Filesystem.writeFile({
      path: filename,
      data: content,
      directory: Directory.Cache,
      encoding: Encoding.UTF8
    });
    
    console.log(`[Share] File written to cache: ${result.uri}`);

    // Mở Share dialog - user tự chọn nơi lưu
    await Share.share({
      title: 'Lưu file sao lưu',
      text: `Chọn nơi lưu: ${filename}`,
      url: result.uri,
      dialogTitle: 'Lưu thời khóa biểu vào...'
    });
    
    console.log('[Share] Share dialog completed');
  } catch (error) {
    console.error('[Share] Error:', error);
    throw new Error('Không thể chia sẻ file. Vui lòng thử lại.');
  }
};

/**
 * Download file helper cho Web
 */
const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

