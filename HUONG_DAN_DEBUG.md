# Hướng Dẫn Debug - Export/Import Issue

## 🐛 Vấn Đề: Import chưa restore đúng

Để debug kỹ, bạn cần gửi mình console logs.

---

## 📱 Cách Xem Console Logs Trên Android

### **Option 1: Chrome Remote Debugging (Khuyên dùng)**

**Bước 1:** Kích hoạt Developer Mode trên điện thoại
1. Settings → About Phone
2. Nhấn "Build Number" 7 lần
3. Developer options xuất hiện

**Bước 2:** Bật USB Debugging
1. Settings → Developer Options
2. Bật "USB Debugging"

**Bước 3:** Kết nối máy tính
1. Cắm USB vào máy tính
2. Điện thoại hỏi "Allow USB debugging?" → Allow

**Bước 4:** Mở Chrome DevTools
1. Máy tính: Mở Chrome browser
2. Vào: `chrome://inspect/#devices`
3. Sẽ thấy device của bạn listed
4. Click "inspect" bên dưới tên app
5. DevTools mở → Tab Console

**Bước 5:** Test Export/Import
1. Trong app, click Export
2. Xem logs trong DevTools Console
3. Sau đó Import
4. Copy TẤT CẢ logs gửi mình

---

### **Option 2: Logcat (Alternative)**

```bash
# Trên máy tính, chạy:
adb logcat | grep -i "Export\|Import\|Settings"
```

---

## 🧪 Test Plan

### **TEST 1: Export**

**Action:** Click "Export JSON"

**Expected Logs:**
```
[Export] Starting export with: { subjectsCount: 33, hasSettings: true, ... }
[Export] JSON length: XXXXX chars
[Export] First 200 chars: {"version":"1.0","exportDate":"2025-10-30","subjects":[...
[Export] Native platform detected, using Share API
[Share] Starting share for file: timetable-2025-10-30.json
[Share] File written to cache: file://...
[Share] Share dialog completed
```

**Gửi mình:**
- ✅ Toàn bộ logs trên
- ✅ Screenshot share dialog (nếu xuất hiện)
- ✅ File JSON content (200 ký tự đầu đã show trong log)

---

### **TEST 2: Import**

**Action:** Import file vừa export

**Expected Logs:**
```
[Import] Parsed data: { subjectsCount: 33, hasSettings: true, timetableTitle: "..." }
[ExportImportModal] Importing: { subjectsCount: 33, hasSettings: true }
[App] ========== IMPORT START ==========
[App] Importing data: { subjectsCount: 33, hasSettings: true, settingsDetail: {...} }
[App] Setting subjects...
[App] Subjects set complete
[App] Calling updateSettings with: { theme: "light", language: "vi", ... }
[SettingsContext] Updating settings: { ... }
[App] updateSettings called
[App] ========== IMPORT END ==========
```

**Gửi mình:**
- ✅ Toàn bộ logs trên
- ✅ Screenshot sau khi import (title ở top)
- ✅ Toast message: "Đã khôi phục dữ liệu!" hay "...và cài đặt!"

---

## 🎯 Checklist

Sau khi import, kiểm tra:

**1. Toast Message:**
- [ ] "Đã khôi phục dữ liệu!" → ❌ KHÔNG có settings
- [ ] "Đã khôi phục dữ liệu và cài đặt!" → ✅ CÓ settings

**2. Title ở top:**
- [ ] "Thời khóa biểu" → ❌ Default (không restore)
- [ ] "THỜI KHÓA BIỂU LỚP 8/7" → ✅ Từ file (restored)

**3. Số môn học:**
- [ ] 33 môn → ✅
- [ ] Ít hơn → ❌

**4. Thời gian các tiết:**
- [ ] Giờ học đúng với file ban đầu? 
  - Tiết 1: 07:30-08:15 ✅
  - Tiết 2: 08:15-09:00 ✅
  - etc.

---

## 📝 Info Cần Gửi Mình

**Format:**
```
=== EXPORT TEST ===
Toast: "Vui lòng chọn nơi lưu file!"
Share dialog: [Có/Không xuất hiện]
Logs:
[Copy paste toàn bộ logs từ console]

=== IMPORT TEST ===  
Toast: "Đã khôi phục dữ liệu..." [copy chính xác]
Title sau import: "..." [copy chính xác]
Số môn: XX
Logs:
[Copy paste toàn bộ logs từ console]

=== SCREENSHOTS ===
[Attach ảnh nếu có]
```

---

## 🔍 Common Issues

### Issue 1: "hasSettings: false"
**Nghĩa:** Export không include settings
**Fix:** Check ExportImportModal có pass settings không

### Issue 2: "WARNING: No settings in import result"
**Nghĩa:** File JSON không có settings field
**Fix:** File bị corrupted hoặc export sai format

### Issue 3: Settings restored nhưng bị override
**Nghĩa:** localStorage conflict
**Fix:** Check timing và localStorage keys

---

## 🚀 Next Steps

1. **Rebuild APK với debug logs mới**
2. **Kết nối Chrome DevTools**
3. **Test Export → Copy logs**
4. **Test Import → Copy logs**  
5. **Gửi mình TOÀN BỘ info trên**
6. **Mình sẽ analyze và fix tiếp!**

---

Với logs chi tiết này, mình sẽ biết chính xác vấn đề ở đâu! 🔍

