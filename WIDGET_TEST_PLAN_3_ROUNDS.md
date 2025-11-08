# 🧪 WIDGET TEST PLAN - 3 ROUNDS (Chuyên Gia Level)

## ✅ ĐÃ FIX

### Vấn Đề:
- Widget hiển thị "Can't load widget"
- Widget Provider bị crash khi khởi tạo

### Root Cause:
- Layout XML quá phức tạp với custom drawable
- Thiếu error handling trong Widget Provider
- RemoteViews không hỗ trợ một số thuộc tính

### Giải Pháp Đã Áp Dụng:
1. ✅ **Đơn giản hóa layout XML HOÀN TOÀN**
   - Loại bỏ `@drawable/widget_background` → Dùng solid color `#FFFFFF`
   - Loại bỏ View divider
   - Loại bỏ `android:lineSpacingExtra`
   - Loại bỏ `android:scrollbars`
   - Loại bỏ `layout_weight`
   - Chỉ dùng các thuộc tính cơ bản 100% hỗ trợ

2. ✅ **Thêm Error Handling Mạnh Mẽ**
   - Try-catch bao quanh toàn bộ logic
   - Fallback widget hiển thị lỗi nếu crash
   - Logs chi tiết để debug

3. ✅ **Enhanced Logging**
   - Log mọi bước: RemoteViews creation, data loading, widget update
   - Log errors với full stack trace
   - Dễ dàng identify vấn đề

---

## 🔬 TEST ROUND 1: BASIC FUNCTIONALITY TEST

### Mục Tiêu:
Verify widget CÓ THỂ LOAD được (không còn "Can't load widget")

### Các Bước Test:

#### 1.1. Clean Build (BẮT BUỘC!)

```bash
# Trong Android Studio:
1. Build → Clean Project
2. Đợi xong
3. Build → Rebuild Project
4. Đợi xong (quan trọng!)
```

#### 1.2. Uninstall App Cũ

```
1. Trên điện thoại/emulator
2. Long press app icon
3. Chọn "Uninstall" / "Gỡ cài đặt"
4. Confirm
```

#### 1.3. Install Fresh APK

```bash
# Trong Android Studio:
1. Run → Run 'app'
2. Chọn device
3. Đợi install xong
```

#### 1.4. Mở Logcat NGAY

```
1. Android Studio → Logcat tab (dưới cùng)
2. Filter: "TimetableWidget"
3. Clear logs (icon 🗑️)
4. SẴN SÀNG XEM LOGS
```

#### 1.5. Test Widget

```
1. Thêm widget lên màn hình chính
2. QUAN SÁT ngay:
   - Widget có hiển thị KHÔNG?
   - Widget có text gì?
   - Widget có lỗi không?
```

### ✅ PASS Criteria (Round 1):

- [ ] Widget KHÔNG còn "Can't load widget"
- [ ] Widget hiển thị ÍT NHẤT text mặc định: "Thời khóa biểu ngày mai", "Thứ Hai - 01/01/2024", "Đang tải..."
- [ ] Logcat có log: `✅ RemoteViews created successfully`
- [ ] Logcat có log: `✅ Widget updated successfully`
- [ ] KHÔNG CÓ log: `❌ CRITICAL ERROR`

### ❌ FAIL Actions (Round 1):

Nếu vẫn "Can't load widget":

1. **Check Logcat ngay:**
   - Có log `❌ CRITICAL ERROR`?
   - Error message là gì?
   - Error class là gì?

2. **Chụp ảnh logs** và gửi cho dev

3. **Kiểm tra:**
   - File `timetable_widget.xml` có compile lỗi không? (Check Build output)
   - R.layout.timetable_widget có tồn tại không?

---

## 🔬 TEST ROUND 2: DATA SYNC TEST

### Tiền Đề:
Round 1 PHẢI PASS trước khi làm Round 2

### Mục Tiêu:
Verify app CÓ THỂ SYNC data sang widget

### Các Bước Test:

#### 2.1. Mở App & Thêm Môn Học

```
1. Mở app "Time Table"
2. Tap nút + (FAB button)
3. Thêm môn học vào NGÀY MAI:
   - Tên: "Toán"
   - Thời gian: 07:00 - 08:00
   - Ngày: NGÀY MAI (ví dụ hôm nay Thứ 4 → chọn Thứ 5)
   - Phòng: A101
   - Giáo viên: Nguyễn Văn A
4. Save
```

#### 2.2. Kiểm Tra Logcat

```
Sau khi save môn học, PHẢI thấy logs:

TimetableStorage: ✅ Saved 1 subjects, success=true
TimetableStorage: 📝 Data: [{"id":"...","name":"Toán",...}]
TimetableWidget: 🔄 updateAppWidget called for ID: XXX
```

#### 2.3. Kiểm Tra Widget

```
1. Xem widget trên màn hình chính
2. Widget có hiển thị môn "Toán" không?
3. Có đúng thời gian 07:00 - 08:00 không?
4. Có đúng phòng A101 không?
```

#### 2.4. Test Refresh

```
1. Xóa widget
2. Thêm lại widget
3. Widget có vẫn hiển thị data không?
```

### ✅ PASS Criteria (Round 2):

- [ ] Logcat có `TimetableStorage: ✅ Saved...` sau khi thêm môn
- [ ] Widget hiển thị ĐÚNG môn học vừa thêm
- [ ] Widget hiển thị đúng thời gian, phòng, giáo viên
- [ ] Xóa widget và thêm lại vẫn hiển thị data

### ❌ FAIL Actions (Round 2):

Nếu widget không hiển thị data:

1. **Check Logcat:**
   ```
   - Có log "Saved subjects" không?
   - Có log "Found X subjects for next day" không?
   - Số X = 0 hay > 0?
   ```

2. **Kiểm tra ngày:**
   - Môn học có đúng vào NGÀY MAI không?
   - Hôm nay là thứ mấy?
   - Widget hiển thị ngày nào?

3. **Debug:**
   ```
   - Logs show "Total subjects in DB: 0" → App chưa sync
   - Logs show "Final result: 0 subjects for day X" → Ngày không match
   - Không có logs → Plugin chưa được call
   ```

---

## 🔬 TEST ROUND 3: STRESS TEST & EDGE CASES

### Tiền Đề:
Round 1 VÀ Round 2 PHẢI PASS

### Mục Tiêu:
Test các trường hợp đặc biệt và stress

### Test Case 3.1: Nhiều Môn Học (>5 môn)

```
1. Thêm 7 môn học vào cùng 1 ngày (ngày mai)
2. Kiểm tra widget:
   - Hiển thị 5 môn đầu tiên
   - Có text "... và 2 môn khác" ở cuối
```

**Expected:**
```
📚 Toán
🕐 07:00 - 08:00

📚 Văn
🕐 08:00 - 09:00

... (3 môn khác)

... và 2 môn khác
```

### Test Case 3.2: Không Có Môn Học Ngày Mai

```
1. Xóa TẤT CẢ môn học vào ngày mai
2. Kiểm tra widget:
   - Hiển thị: "Không có lịch học ngày mai 🎉"
```

### Test Case 3.3: Chuyển Ngày (Midnight Test)

```
1. Test vào cuối ngày (23:00)
2. Đợi qua 00:00 (sang ngày mới)
3. Widget có tự động update ngày mới không?
   (Có thể cần đợi đến 1h - widget update mỗi 1 giờ)
```

### Test Case 3.4: Reboot Device

```
1. Restart điện thoại/emulator
2. Sau khi boot xong, check widget
3. Widget có vẫn hiển thị data không?
```

### Test Case 3.5: App Force Stop

```
1. Settings → Apps → Time Table → Force Stop
2. Check widget
3. Widget có vẫn hoạt động không?
```

### ✅ PASS Criteria (Round 3):

- [ ] Widget giới hạn hiển thị 5 môn đầu tiên
- [ ] Hiển thị "... và X môn khác" nếu >5 môn
- [ ] Hiển thị "Không có lịch học ngày mai" nếu empty
- [ ] Widget persist sau reboot
- [ ] Widget hoạt động ngay cả khi app bị force stop

---

## 📊 FINAL CHECKLIST - 3 ROUNDS COMPLETED

### Round 1: Basic Functionality ✅
- [ ] Widget load được (không "Can't load widget")
- [ ] Hiển thị text mặc định
- [ ] Logs không có error

### Round 2: Data Sync ✅
- [ ] App sync data sang widget
- [ ] Widget hiển thị đúng môn học
- [ ] Data persist sau khi xóa/thêm lại widget

### Round 3: Edge Cases ✅
- [ ] Giới hạn 5 môn hoạt động đúng
- [ ] Empty state hiển thị đúng
- [ ] Widget persist sau reboot

---

## 🐛 COMMON ISSUES & FIX

### Issue 1: Widget vẫn "Can't load widget"

**Nguyên nhân:** Layout XML vẫn có vấn đề hoặc R.layout không compile

**Fix:**
```
1. Clean Project
2. Rebuild Project
3. Kiểm tra Build Output có lỗi XML không
4. Nếu có lỗi → Fix XML và rebuild
```

### Issue 2: Widget trắng (không có text mặc định)

**Nguyên nhân:** Widget Provider không chạy

**Fix:**
```
1. Check Logcat có bất kỳ log TimetableWidget nào không
2. Nếu không có logs → Provider chưa được trigger
3. Xóa widget, clean project, rebuild, thêm lại
```

### Issue 3: Widget hiển thị "Đang tải..." mãi

**Nguyên nhân:** App chưa sync data hoặc sync failed

**Fix:**
```
1. Check Logcat có "Saved subjects" không
2. Mở app và thêm/sửa 1 môn học
3. Xóa widget và thêm lại
```

### Issue 4: Widget không update khi thêm môn mới

**Nguyên nhân:** Sync không được trigger

**Fix:**
```
1. Force close app
2. Mở app lại
3. Thêm/sửa môn học
4. Check logs có "Saved subjects" + "updateAppWidget called"
```

---

## 📸 DOCUMENTATION

### Khi Test, Chụp Ảnh:

1. **Screenshot widget** (mỗi round)
2. **Screenshot Logcat** (filter TimetableWidget + TimetableStorage)
3. **Screenshot Build Output** (nếu có lỗi)
4. **Video test** (nếu cần)

### Gửi Cho Dev Nếu FAIL:

- ✅ Ảnh widget (hiện trạng)
- ✅ Ảnh Logcat (full logs)
- ✅ Round nào FAIL (1, 2, hay 3)
- ✅ Steps để reproduce

---

## ✅ SUCCESS CRITERIA - TẤT CẢ 3 ROUNDS

Widget được coi là **HOÀN TOÀN THÀNH CÔNG** khi:

1. ✅ **Round 1 PASS:** Widget load được, không crash
2. ✅ **Round 2 PASS:** Widget hiển thị đúng data từ app
3. ✅ **Round 3 PASS:** Widget handle edge cases tốt

**CHÚC BẠN TEST THÀNH CÔNG! 🎉**

---

**Notes:**
- Mỗi round PHẢI PASS mới làm round tiếp theo
- Nếu bất kỳ round nào FAIL → Stop và debug
- Đọc kỹ FAIL Actions để biết cách troubleshoot
- Logcat là công cụ quan trọng nhất để debug!

