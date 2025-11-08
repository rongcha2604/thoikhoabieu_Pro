package com.example.app;

import android.content.Context;
import android.content.SharedPreferences;
import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "TimetableStorage")
public class TimetableStoragePlugin extends Plugin {
    
    private static final String PREFS_NAME = "TimetablePrefs";
    private static final String KEY_SUBJECTS = "subjects";
    
    @PluginMethod
    public void saveSubjects(PluginCall call) {
        JSArray subjects = call.getArray("subjects");
        
        if (subjects == null) {
            call.reject("Subjects data is required");
            return;
        }
        
        try {
            Context context = getContext();
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = prefs.edit();
            
            String subjectsJson = subjects.toString();
            
            // Lưu JSON string vào SharedPreferences
            editor.putString(KEY_SUBJECTS, subjectsJson);
            boolean saved = editor.commit(); // Dùng commit() thay vì apply() để đồng bộ
            
            android.util.Log.d("TimetableStorage", "✅ Saved " + subjects.length() + " subjects, success=" + saved);
            android.util.Log.d("TimetableStorage", "📝 Data: " + subjectsJson.substring(0, Math.min(200, subjectsJson.length())));
            
            // Trigger widget update
            TimetableWidgetProvider.updateWidget(context);
            
            call.resolve();
        } catch (Exception e) {
            android.util.Log.e("TimetableStorage", "❌ Failed to save: " + e.getMessage(), e);
            call.reject("Failed to save subjects: " + e.getMessage());
        }
    }
    
    @PluginMethod
    public void getSubjects(PluginCall call) {
        try {
            Context context = getContext();
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            String subjectsJson = prefs.getString(KEY_SUBJECTS, "[]");
            
            call.resolve(new com.getcapacitor.JSObject().put("subjects", subjectsJson));
        } catch (Exception e) {
            call.reject("Failed to get subjects: " + e.getMessage());
        }
    }
}

