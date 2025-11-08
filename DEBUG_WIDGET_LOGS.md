# 🐛 Debug Widget - Xem Logs

## ⚠️ Widget Trắng Bóc? Làm Theo Đây!

### 📱 Bước 1: Rebuild App Với Debug Logs

```bash
# Build web
npm run build

# Sync Capacitor
npx cap sync

# Mở Android Studio
npx cap open android
```

### 🔨 Bước 2: Build & Install (Android Studio)

1. **Clean Project**
   - `Build` → `Clean Project`

2. **Rebuild Project**
   - `Build` → `Rebuild Project`

3. **Install Debug APK**
   - `Run` → `Run 'app'`
   - Chọn điện thoại của bạn
   - Đợi cài đặt xong

### 📊 Bước 3: Xem Logs Trong Android Studio

1. **Mở Logcat**
   - Tab `Logcat` ở dưới cùng Android Studio
   - Hoặc: `View` → `Tool Windows` → `Logcat`

2. **Filter Logs**
   - Trong ô tìm kiếm Logcat, gõ: `TimetableWidget|TimetableStorage`
   - Hoặc chọn filter dropdown → `Edit Filter Configuration` → Thêm:
     - Tag: `TimetableWidget`
     - Tag: `TimetableStorage`

3. **Chọn Device**
   - Dropdown trên cùng: Chọn điện thoại của bạn
   - Dropdown thứ 2: Chọn `com.example.app`

### 🔍 Bước 4: Test & Xem Logs

#### 4A: Test Sync Data

1. **Mở app** trên điện thoại
2. **Xem logs** trong Logcat, tìm:
   ```
   TimetableStorage: ✅ Saved X subjects, success=true
   TimetableStorage: 📝 Data: [{"id":"...","name":"..."}]
   ```

3. **Nếu KHÔNG thấy logs** → Plugin chưa được gọi!
   - Kiểm tra: App có data không? (có môn học chưa?)
   - Thử thêm/sửa 1 môn học xem có logs không

#### 4B: Test Widget Render

1. **Thêm widget** lên màn hình chính
2. **Xem logs** trong Logcat, tìm:
   ```
   TimetableWidget: 🔄 updateAppWidget called for ID: XXX
   TimetableWidget: 📅 Next day (App format): X
   TimetableWidget: 📖 Reading subjects from SharedPrefs
   TimetableWidget: 📚 Total subjects in DB: X
   TimetableWidget: ✅ Final result: X subjects for day X
   ```

3. **Phân tích logs:**

**✅ CASE 1: Widget hoạt động tốt**
```
TimetableWidget: 📚 Total subjects in DB: 5
TimetableWidget: 🔍 Filtering for day: 1
TimetableWidget:   - Subject #0: Toán (day=0)
TimetableWidget:   - Subject #1: Văn (day=1)
TimetableWidget:     ✅ Added: Văn at 08:00
TimetableWidget: ✅ Final result: 1 subjects for day 1
```
→ Widget đang hoạt động! Nếu vẫn trắng, có thể là layout issue.

**❌ CASE 2: Không có data**
```
TimetableWidget: 📚 Total subjects in DB: 0
TimetableWidget: ✅ Final result: 0 subjects for day 1
```
→ **Nguyên nhân:** App chưa sync data sang widget!
→ **Giải pháp:** Mở app, thêm/sửa 1 môn học

**❌ CASE 3: Có data nhưng không match ngày**
```
TimetableWidget: 📚 Total subjects in DB: 5
TimetableWidget: 🔍 Filtering for day: 2 (Thứ Tư)
TimetableWidget:   - Subject #0: Toán (day=0) <- Thứ 2
TimetableWidget:   - Subject #1: Văn (day=1)  <- Thứ 3
TimetableWidget: ✅ Final result: 0 subjects for day 2
```
→ **Nguyên nhân:** Không có môn học vào ngày mai!
→ **Giải pháp:** Thêm môn học vào ngày mai (ví dụ hôm nay Thứ 2 thì thêm vào Thứ 3)

**❌ CASE 4: Lỗi parse JSON**
```
TimetableWidget: ❌ Error parsing subjects: ...
```
→ **Nguyên nhân:** JSON format sai!
→ **Giải pháp:** Xem full stack trace, kiểm tra format JSON

### 📋 Checklist Debug

- [ ] **Build thành công** trong Android Studio
- [ ] **App chạy được** trên điện thoại
- [ ] **Có môn học** trong app (ít nhất 1 môn)
- [ ] **Logs hiển thị** khi mở app: `TimetableStorage: ✅ Saved...`
- [ ] **Widget được thêm** lên màn hình chính
- [ ] **Logs hiển thị** khi thêm widget: `TimetableWidget: 🔄 updateAppWidget...`
- [ ] **Có môn học vào NGÀY MAI** (không phải hôm nay!)
- [ ] **Logs show** số môn học > 0 cho ngày mai

### 🔧 Troubleshooting Cụ Thể

#### ❌ Không thấy logs `TimetableStorage` khi mở app

**Nguyên nhân:** Plugin chưa được gọi

**Kiểm tra:**
1. Mở Developer Tools trong app (web debug)
2. Console có lỗi `TimetableStorage plugin not available`?
3. File `MainActivity.java` có `registerPlugin(TimetableStoragePlugin.class)`?

**Fix:**
- Rebuild lại app
- Gỡ app cũ hoàn toàn
- Cài app mới

#### ❌ Logs show "0 subjects" nhưng app có data

**Nguyên nhân:** Sync chưa được trigger

**Fix:**
1. Mở app
2. Thêm hoặc sửa 1 môn học (trigger sync)
3. Xem logs có `TimetableStorage: ✅ Saved...` không
4. Xóa widget và thêm lại

#### ❌ Widget vẫn trắng dù logs đúng

**Nguyên nhân:** Layout issue hoặc R.id không tìm thấy

**Kiểm tra:**
1. Trong Logcat, filter: `AndroidRuntime`
2. Có lỗi "Resource not found" hoặc "ClassCastException"?

**Fix:**
- Clean + Rebuild Project
- Kiểm tra file `timetable_widget.xml` syntax
- Đảm bảo các ID match: `widget_header`, `widget_date`, `widget_content`

### 💡 Tips Debug

1. **Luôn xem logs ngay sau khi:**
   - Mở app lần đầu
   - Thêm/sửa môn học
   - Thêm widget lên màn hình

2. **Nếu logs quá nhiều:**
   - Dùng filter: `tag:TimetableWidget` và `tag:TimetableStorage`
   - Clear logs: Click icon 🗑️ trong Logcat

3. **Copy logs để gửi cho dev:**
   - Select logs → Right click → Copy
   - Paste vào text file

### 📸 Gửi Logs Nếu Cần Hỗ Trợ

Nếu vẫn không fix được, chụp ảnh logs và gửi:

1. **Logs khi mở app** (TimetableStorage logs)
2. **Logs khi thêm widget** (TimetableWidget logs)
3. **Screenshot widget** (trắng bóc)
4. **Screenshot app** (có data không?)

---

**Chúc bạn debug thành công! 🎉**

