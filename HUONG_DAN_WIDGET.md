# 📱 Hướng Dẫn Sử Dụng Widget Thời Khóa Biểu

## ✨ Tính Năng

Widget Android hiển thị thời khóa biểu của **ngày tiếp theo** trên màn hình chính điện thoại, không cần mở ứng dụng.

**Ví dụ:** 
- Hôm nay là Thứ 2 → Widget hiển thị lịch Thứ 3
- Hôm nay là Thứ 7 → Widget hiển thị lịch Chủ Nhật
- Hôm nay là Chủ Nhật → Widget hiển thị lịch Thứ 2

## 📋 Yêu Cầu

- Android 5.0 (API 21) trở lên
- Đã build và cài đặt app trên điện thoại

## 🔧 Rebuild App Sau Khi Thêm Widget

### Bước 1: Build web assets
```bash
npm run build
```

### Bước 2: Sync với Capacitor
```bash
npx cap sync
```

### Bước 3: Build Android App
```bash
# Mở Android Studio
npx cap open android

# Hoặc dùng script có sẵn
open-android-studio.bat
```

### Bước 4: Build APK
Trong Android Studio:
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Đợi build xong
3. Cài đặt APK lên điện thoại

## 📲 Cách Thêm Widget Vào Màn Hình Chính

### Cách 1: Từ Màn Hình Chính
1. Long press (nhấn giữ) vào vùng trống trên màn hình chính
2. Chọn **Widgets** (hoặc **Tiện ích**)
3. Tìm app **"Time Table"**
4. Kéo widget **"Thời khóa biểu ngày mai"** vào màn hình chính
5. Chọn vị trí và thả

### Cách 2: Từ App Drawer
1. Mở App Drawer (danh sách ứng dụng)
2. Long press vào icon app **Time Table**
3. Chọn **Widgets** từ menu popup
4. Kéo widget vào màn hình chính

## 🔄 Cách Widget Cập Nhật

### Tự Động:
- Widget tự động cập nhật mỗi 1 giờ (Android system limitation)
- Cập nhật khi hệ thống reboot

### Thủ Công:
- Mỗi khi bạn **mở app** → Widget tự động sync data mới nhất
- Khi **thêm/sửa/xóa** môn học → Widget tự động cập nhật
- Khi **import** dữ liệu → Widget tự động cập nhật

## 🎨 Thiết Kế Widget

- **Theme:** Light (dễ đọc trên màn hình chính)
- **Size:** Large (4x4 cells) - tùy chỉnh được
- **Background:** Trắng với bo góc và viền nhẹ
- **Font:** Rõ ràng, dễ đọc

## 📊 Nội Dung Hiển Thị

Widget hiển thị:
- 📅 Header: "Thời khóa biểu ngày mai"
- 📆 Ngày: "Thứ X - DD/MM/YYYY"
- 📚 Danh sách môn học:
  - Tên môn
  - Giờ học (start - end)
  - Phòng học (nếu có)
  - Giáo viên (nếu có)

### Empty State:
- Nếu không có lịch học ngày mai → Hiển thị: **"Không có lịch học ngày mai 🎉"**

## 🐛 Troubleshooting

### ⚠️ Widget báo lỗi "Đã xảy ra lỗi khi tải tiện ích":
**Nguyên nhân:** Code widget cũ dùng ScrollView (không được hỗ trợ)

**Giải pháp:**
1. **GỠ APP CŨ HOÀN TOÀN** (quan trọng!)
2. Rebuild app: `npm run build` → `npx cap sync`
3. Clean + Rebuild trong Android Studio
4. Build APK mới và cài đặt
5. Mở app ít nhất 1 lần
6. Thêm widget lại

👉 **Chi tiết:** Xem file `REBUILD_WIDGET.md`

### Widget không hiển thị data:
1. Mở app ít nhất 1 lần để sync data
2. Thêm/sửa 1 môn học để trigger sync
3. Xóa widget và thêm lại
4. Kiểm tra có môn học vào ngày mai không

### Widget không cập nhật:
1. Mở app để force sync
2. Thêm/sửa môn học
3. Restart điện thoại (widget sẽ update khi reboot)

### Widget bị lỗi layout:
1. Gỡ app cũ
2. Rebuild app (Clean + Rebuild Project)
3. Cài app mới
4. Thêm widget lại

## 💡 Tips

- Widget chỉ hoạt động trên **Android native app** (không hoạt động trên web browser)
- Data được sync từ app sang widget tự động
- Widget read-only (không thể edit trực tiếp từ widget)
- Tap vào widget không làm gì (display-only)
- **Widget chỉ hiển thị tối đa 5 môn học** - Nếu ngày mai có >5 môn, widget sẽ hiện "... và X môn khác"
- Nếu muốn xem đầy đủ, mở app để xem chi tiết

## 🔨 Kỹ Thuật (Dành Cho Dev)

### Files Liên Quan:
- **Java Plugin:** `android/app/src/main/java/com/example/app/TimetableStoragePlugin.java`
- **Widget Provider:** `android/app/src/main/java/com/example/app/TimetableWidgetProvider.java`
- **Widget Layout:** `android/app/src/main/res/layout/timetable_widget.xml`
- **Widget Info:** `android/app/src/main/res/xml/timetable_widget_info.xml`
- **Web Sync:** `utils/widgetSync.ts`

### Data Flow:
```
IndexedDB (Web) 
  → Capacitor Plugin (TimetableStoragePlugin)
  → SharedPreferences (Android)
  → Widget Provider (TimetableWidgetProvider)
  → RemoteViews (Widget UI)
```

### Auto Sync Points:
1. App mount (useEffect in App.tsx)
2. Add subject (useTimetable hook)
3. Update subject (useTimetable hook)
4. Delete subject (useTimetable hook)
5. Import data (App.tsx handleImport)

## 📝 Notes

- Widget update interval: 1 giờ (3600000ms) - Android minimum là 30 phút
- Data storage: SharedPreferences (key: "subjects", max ~1MB)
- Format: JSON array của Subject objects
- Day format: 0=Monday, 1=Tuesday, ..., 5=Saturday, 6=Sunday
- **Display limit: Tối đa 5 môn học** - Để tránh text quá dài không vừa widget
- Widget không hỗ trợ scroll - Nếu >5 môn, mở app để xem đầy đủ

## ⚠️ Known Limitations

- **ScrollView không được hỗ trợ** trong Android Widget (Android limitation)
- Chỉ hiển thị 5 môn học đầu tiên (sorted by time)
- Không thể scroll trong widget
- Widget size: Tối thiểu 4x4 cells

---

**Chúc bạn sử dụng widget vui vẻ! 🎉**

