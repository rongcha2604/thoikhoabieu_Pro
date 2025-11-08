# 🔨 Hướng Dẫn Rebuild App Sau Khi Fix Widget

## ⚠️ Lỗi Đã Fix

**Lỗi:** "Đã xảy ra lỗi khi tải tiện ích"

**Nguyên nhân:** ScrollView không được hỗ trợ trong Android Widget

**Giải pháp:** 
- ✅ Bỏ ScrollView, dùng TextView trực tiếp
- ✅ Giới hạn hiển thị tối đa 5 môn học
- ✅ Thêm text "... và X môn khác" nếu có nhiều hơn 5 môn

---

## 🚀 REBUILD APP - 4 BƯỚC

### Bước 1: Build Web Assets
```bash
npm run build
```

### Bước 2: Sync với Capacitor
```bash
npx cap sync
```

### Bước 3: Mở Android Studio
```bash
npx cap open android

# Hoặc dùng script
open-android-studio.bat
```

### Bước 4: Build APK trong Android Studio

1. **Clean Project** (Quan trọng!)
   - Menu: `Build` → `Clean Project`
   - Đợi clean xong

2. **Rebuild Project**
   - Menu: `Build` → `Rebuild Project`
   - Đợi rebuild xong

3. **Build APK**
   - Menu: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Đợi build xong (~2-3 phút)

4. **Cài đặt APK**
   - Click vào link APK trong notification Android Studio
   - Hoặc tìm file APK tại: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Copy sang điện thoại và cài đặt
   - **Lưu ý:** Phải **Gỡ app cũ** trước khi cài mới!

---

## 📱 Test Widget

### Gỡ App Cũ (Bắt buộc!)
1. Long press app icon
2. Chọn **Gỡ cài đặt** / **Uninstall**
3. Confirm

### Cài App Mới
1. Cài APK mới vừa build
2. Mở app lần đầu
3. Thêm ít nhất 1 môn học

### Thêm Widget
1. Long press màn hình chính
2. Chọn **Widgets** (Tiện ích)
3. Tìm **Time Table**
4. Kéo widget **"Thời khóa biểu ngày mai"** ra màn hình
5. Thả và xem widget hiển thị!

---

## ✅ Widget Sẽ Hiển Thị

```
┌─────────────────────────────────┐
│  Thời khóa biểu ngày mai        │
│  Thứ Ba - 30/10/2025            │
│ ─────────────────────────────── │
│                                 │
│ 📚 Toán                         │
│ 🕐 07:00 - 08:00                │
│ 📍 Phòng: A101                  │
│ 👨‍🏫 GV: Nguyễn Văn A             │
│                                 │
│ 📚 Văn                          │
│ 🕐 08:00 - 09:00                │
│ 📍 Phòng: A102                  │
│                                 │
│ ... và 3 môn khác               │
└─────────────────────────────────┘
```

**Hoặc nếu không có lịch:**

```
┌─────────────────────────────────┐
│  Thời khóa biểu ngày mai        │
│  Chủ Nhật - 03/11/2025          │
│ ─────────────────────────────── │
│                                 │
│ Không có lịch học ngày mai 🎉  │
│                                 │
└─────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### ⚠️ Widget TRẮNG BÓC (không hiển thị gì)?

**QUAN TRỌNG:** App đã có **debug logs** để tìm nguyên nhân!

👉 **Xem hướng dẫn chi tiết:** `DEBUG_WIDGET_LOGS.md`

**Quick debug:**
1. Mở Android Studio
2. Mở tab **Logcat** (ở dưới cùng)
3. Filter: `TimetableWidget` hoặc `TimetableStorage`
4. Mở app trên điện thoại
5. Xem logs để biết nguyên nhân!

**Logs sẽ cho biết:**
- ✅ App có sync data không?
- ✅ Widget có nhận được data không?
- ✅ Có môn học vào ngày mai không?
- ✅ Lỗi gì đang xảy ra?

### Widget vẫn báo lỗi?
✅ **Kiểm tra đã gỡ app cũ chưa** - Phải gỡ hoàn toàn!
✅ **Clean + Rebuild trong Android Studio** - Đừng skip bước này
✅ **Mở app ít nhất 1 lần** - Để sync data
✅ **Thêm môn học** - Widget cần có data để hiển thị
✅ **XEM LOGS** - Mở Logcat để biết chính xác lỗi gì!

### Widget không hiển thị data?
✅ Mở app và thêm/sửa 1 môn học
✅ Xóa widget và thêm lại
✅ Kiểm tra xem có môn học vào **NGÀY MAI** không (không phải hôm nay!)
✅ **XEM LOGS** trong Android Studio Logcat

### Muốn test ngay?
- Thêm môn học vào **ngày tiếp theo** (ví dụ hôm nay Thứ 2, thêm môn vào Thứ 3)
- Widget hiển thị **ngày mai**, không phải hôm nay!
- Mở Logcat để xem widget có đọc được data không

---

## 💡 Lưu Ý Quan Trọng

- ⚠️ **Phải GỠ app cũ** trước khi cài app mới (để update widget layout)
- ⏰ Widget hiển thị **ngày mai**, không phải hôm nay
- 📊 Chỉ hiển thị **tối đa 5 môn** (nếu nhiều hơn sẽ có "... và X môn khác")
- 🔄 Widget tự động update mỗi 1 giờ hoặc khi bạn thêm/sửa môn học trong app
- 📱 Widget chỉ hoạt động trên **Android native app**, không hoạt động trên web

---

**Chúc bạn thành công! 🎉**

Nếu vẫn gặp lỗi, vui lòng gửi ảnh lỗi trong Android Studio (Logcat).

