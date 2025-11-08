package com.example.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import org.json.JSONArray;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

public class TimetableWidgetProvider extends AppWidgetProvider {
    
    private static final String PREFS_NAME = "TimetablePrefs";
    private static final String KEY_SUBJECTS = "subjects";
    
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }
    
    public static void updateWidget(Context context) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName componentName = new ComponentName(context, TimetableWidgetProvider.class);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(componentName);
        
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }
    
    private static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        android.util.Log.d("TimetableWidget", "🔄 updateAppWidget called for ID: " + appWidgetId);
        
        try {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.timetable_widget);
            android.util.Log.d("TimetableWidget", "✅ RemoteViews created successfully");
        
        // Tính toán ngày tiếp theo
        Calendar calendar = Calendar.getInstance();
        int currentDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
        
        android.util.Log.d("TimetableWidget", "📅 Current day of week (Calendar): " + currentDayOfWeek);
        
        // Convert từ Calendar (Sunday=1) sang app format (Monday=0)
        int nextDay = convertToAppDayFormat(currentDayOfWeek);
        
        android.util.Log.d("TimetableWidget", "📅 Next day (App format): " + nextDay);
        
        // Lấy tên ngày
        String[] daysVi = {"Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"};
        String nextDayName = daysVi[nextDay];
        
        // Lấy ngày tháng
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy", new Locale("vi", "VN"));
        String dateStr = dateFormat.format(calendar.getTime());
        
        android.util.Log.d("TimetableWidget", "📅 Display date: " + nextDayName + " - " + dateStr);
        
        // Set header
        views.setTextViewText(R.id.widget_header, "Thời khóa biểu ngày mai");
        views.setTextViewText(R.id.widget_date, nextDayName + " - " + dateStr);
        
        // Đọc subjects từ SharedPreferences
        List<Subject> subjects = getNextDaySubjects(context, nextDay);
        
        android.util.Log.d("TimetableWidget", "📚 Found " + subjects.size() + " subjects for next day");
        
        if (subjects.isEmpty()) {
            views.setTextViewText(R.id.widget_content, "Không có lịch học ngày mai 🎉");
        } else {
            // Build nội dung (giới hạn tối đa 5 môn để fit widget)
            StringBuilder content = new StringBuilder();
            int maxSubjects = Math.min(subjects.size(), 5);
            
            for (int i = 0; i < maxSubjects; i++) {
                Subject subject = subjects.get(i);
                
                content.append("📚 ").append(subject.name).append("\n");
                content.append("🕐 ").append(subject.startTime).append(" - ").append(subject.endTime);
                
                if (subject.room != null && !subject.room.isEmpty()) {
                    content.append("\n📍 Phòng: ").append(subject.room);
                }
                
                if (subject.teacher != null && !subject.teacher.isEmpty()) {
                    content.append("\n👨‍🏫 GV: ").append(subject.teacher);
                }
                
                content.append("\n\n");
            }
            
            // Nếu có nhiều hơn 5 môn, thêm thông báo
            if (subjects.size() > 5) {
                content.append("... và ").append(subjects.size() - 5).append(" môn khác");
            }
            
            views.setTextViewText(R.id.widget_content, content.toString().trim());
        }
        
        appWidgetManager.updateAppWidget(appWidgetId, views);
        android.util.Log.d("TimetableWidget", "✅ Widget updated successfully");
        
        } catch (Exception e) {
            android.util.Log.e("TimetableWidget", "❌ CRITICAL ERROR in updateAppWidget", e);
            android.util.Log.e("TimetableWidget", "Error message: " + e.getMessage());
            android.util.Log.e("TimetableWidget", "Error class: " + e.getClass().getName());
            
            // Create emergency fallback widget
            try {
                RemoteViews errorViews = new RemoteViews(context.getPackageName(), R.layout.timetable_widget);
                errorViews.setTextViewText(R.id.widget_header, "⚠️ Lỗi Widget");
                errorViews.setTextViewText(R.id.widget_date, "Vui lòng xem Logcat");
                errorViews.setTextViewText(R.id.widget_content, "Error: " + e.getMessage());
                appWidgetManager.updateAppWidget(appWidgetId, errorViews);
                android.util.Log.d("TimetableWidget", "📌 Fallback widget displayed");
            } catch (Exception e2) {
                android.util.Log.e("TimetableWidget", "❌ Even fallback failed!", e2);
            }
        }
    }
    
    private static int convertToAppDayFormat(int currentCalendarDay) {
        // Calendar format: Sunday=1, Monday=2, Tuesday=3, Wednesday=4, Thursday=5, Friday=6, Saturday=7
        // App format: Monday=0, Tuesday=1, Wednesday=2, Thursday=3, Friday=4, Saturday=5, Sunday=6
        
        android.util.Log.d("TimetableWidget", "📅 Input currentCalendarDay: " + currentCalendarDay);
        
        // Tính ngày tiếp theo trong Calendar format
        int nextCalendarDay = (currentCalendarDay % 7) + 1;
        android.util.Log.d("TimetableWidget", "📅 Next calendar day: " + nextCalendarDay);
        
        // Convert sang App format
        int appDayFormat;
        if (nextCalendarDay == 1) { 
            // Sunday (Calendar=1) → Sunday (App=6)
            appDayFormat = 6;
        } else { 
            // Monday (Calendar=2) → Monday (App=0)
            // Tuesday (Calendar=3) → Tuesday (App=1)
            // ...
            // Saturday (Calendar=7) → Saturday (App=5)
            appDayFormat = nextCalendarDay - 2;
        }
        
        android.util.Log.d("TimetableWidget", "📅 Final app day format: " + appDayFormat);
        return appDayFormat;
    }
    
    private static List<Subject> getNextDaySubjects(Context context, int day) {
        List<Subject> result = new ArrayList<>();
        
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            String subjectsJson = prefs.getString(KEY_SUBJECTS, "[]");
            
            android.util.Log.d("TimetableWidget", "📖 Reading subjects from SharedPrefs");
            android.util.Log.d("TimetableWidget", "📝 Raw JSON length: " + subjectsJson.length());
            android.util.Log.d("TimetableWidget", "📝 JSON preview: " + subjectsJson.substring(0, Math.min(300, subjectsJson.length())));
            
            JSONArray jsonArray = new JSONArray(subjectsJson);
            
            android.util.Log.d("TimetableWidget", "📚 Total subjects in DB: " + jsonArray.length());
            android.util.Log.d("TimetableWidget", "🔍 Filtering for day: " + day);
            
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject obj = jsonArray.getJSONObject(i);
                int subjectDay = obj.getInt("day");
                
                android.util.Log.d("TimetableWidget", "  - Subject #" + i + ": " + obj.getString("name") + " (day=" + subjectDay + ")");
                
                if (subjectDay == day) {
                    Subject subject = new Subject();
                    subject.name = obj.getString("name");
                    subject.startTime = obj.getString("startTime");
                    subject.endTime = obj.getString("endTime");
                    subject.room = obj.optString("room", "");
                    subject.teacher = obj.optString("teacher", "");
                    
                    result.add(subject);
                    android.util.Log.d("TimetableWidget", "    ✅ Added: " + subject.name + " at " + subject.startTime);
                }
            }
            
            // Sort by startTime
            Collections.sort(result, new Comparator<Subject>() {
                @Override
                public int compare(Subject s1, Subject s2) {
                    return s1.startTime.compareTo(s2.startTime);
                }
            });
            
            android.util.Log.d("TimetableWidget", "✅ Final result: " + result.size() + " subjects for day " + day);
            
        } catch (Exception e) {
            android.util.Log.e("TimetableWidget", "❌ Error parsing subjects: " + e.getMessage(), e);
            e.printStackTrace();
        }
        
        return result;
    }
    
    private static class Subject {
        String name;
        String startTime;
        String endTime;
        String room;
        String teacher;
    }
}

