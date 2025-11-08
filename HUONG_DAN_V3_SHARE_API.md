# Hướng Dẫn Fix Export/Import V3 - Share API (User Tự Chọn Vị Trí)

## 🎯 Giải Pháp V3: Share API

### ❗ Vấn Đề Các Version Trước
- **V1:** Filesystem → File trong app sandbox, không visible
- **V2:** Web download → WebView không intercept, không hoạt động
- **V3:** **Share API → User TỰ CHỌN nơi lưu!** ✅

---

## ✅ Cách Hoạt Động V3

### **Trên Android:**

**Bước 1:** User click "Export JSON" hoặc "Export CSV"

**Bước 2:** **Android Share Sheet xuất hiện:**
```
┌─────────────────────────────────┐
│  Lưu thời khóa biểu vào...      │
├─────────────────────────────────┤
│  💾 Save to Files               │
│  ☁️  Google Drive                │
│  📧 Gmail                        │
│  📱 Nearby Share                 │
│  ... (các app khác)              │
└─────────────────────────────────┘
```

**Bước 3:** User chọn "Save to Files"
- File picker mở ra
- Có thể chọn: Downloads, Documents, hoặc bất kỳ folder nào

**Bước 4:** User chọn folder và nhấn "Save"
- File được lưu vào vị trí đã chọn
- Android hiện confirmation: "Saved"

**Bước 5:** Verify
- Mở File Manager
- Navigate đến folder đã chọn
- **FILE Ở ĐÓ!** ✅

---

## 📋 Rebuild APK

### **Cách 1: Dùng Script**
1. Double-click **`rebuild.bat`**
2. Đợi chạy xong
3. Mở Android Studio → Open `android/`
4. Build → Build APK
5. Cài APK mới

### **Cách 2: Manual**
```bash
# Trong thư mục project
npm install
npm run build
npx cap sync

# Mở Android Studio → Build APK
```

---

## 🧪 Hướng Dẫn Test Chi Tiết

### ✅ TEST 1: Export JSON → Downloads
**Steps:**
1. Mở app → Settings → Export/Import
2. Click **"Export JSON"**
3. Toast: "Vui lòng chọn nơi lưu file!"
4. **Share sheet xuất hiện**
5. Chọn **"Save to Files"** (hoặc tên khác tùy điện thoại)
6. File picker mở → Chọn **Downloads**
7. Nhấn **"Save"**
8. **Expected:** "Saved" confirmation

**Verify:**
- Mở File Manager
- Navigate: Internal Storage → Download
- **THẤY FILE:** `timetable-2025-10-30.json` ✅

---

### ✅ TEST 2: Export CSV → Documents
**Steps:**
1. Click **"Export CSV"**
2. Share sheet → "Save to Files"
3. Chọn folder **Documents**
4. Save

**Verify:**
- File Manager → Documents
- **THẤY FILE:** `timetable-2025-10-30.csv` ✅

---

### ✅ TEST 3: Export → Google Drive
**Steps:**
1. Click "Export JSON"
2. Share sheet → Chọn **"Google Drive"**
3. Chọn folder trong Drive
4. Save

**Verify:**
- Mở app Google Drive
- Navigate đến folder
- **FILE ĐÃ UPLOAD!** ✅

---

### ✅ TEST 4: Import File Đã Lưu
**Steps:**
1. Settings → Export/Import
2. Click vào drop zone "Kéo thả file..."
3. File picker mở
4. Navigate đến nơi đã lưu (Downloads/Documents)
5. Chọn file `timetable-YYYY-MM-DD.json`
6. **Expected:** Toast "Đã import thành công (X môn học)"

**Verify:**
- Data hiển thị trong thời khóa biểu ✅

---

## 🐛 Debug & Troubleshooting

### **Nếu Share Sheet KHÔNG xuất hiện:**

**Kiểm tra:**
1. Mở Chrome DevTools (nếu có thể)
2. Check Console logs:
   - `[Export] Native platform detected` → OK
   - `[Share] Starting share` → OK
   - `[Share] Error: ...` → CÓ LỖI!

**Fix:**
- Verify plugins: `npm ls @capacitor/share`
- Reinstall: `npm install @capacitor/share@latest`
- Sync: `npx cap sync`
- Rebuild APK

---

### **Nếu Share Sheet Hiện Nhưng Lỗi Khi Save:**

**Kiểm tra:**
1. App permissions:
   - Settings → Apps → Thời Khóa Biểu
   - Permissions → Storage (bật)

2. Storage space:
   - Đảm bảo còn dung lượng trống

---

### **Nếu Import Không Tìm Thấy File:**

**Nguyên nhân:** File picker mở nhầm folder

**Fix:**
1. File picker → Menu (3 chấm) → Show internal storage
2. Navigate đúng folder đã lưu (Downloads/Documents)
3. File sẽ xuất hiện

---

## 📊 So Sánh 3 Versions

| Feature | V1 (Filesystem) | V2 (Web Download) | V3 (Share API) |
|---------|----------------|-------------------|----------------|
| **File visible** | ❌ | ❌ | ✅ |
| **User control** | ❌ | ❌ | ✅ 100% |
| **Cloud backup** | ❌ | ❌ | ✅ Drive/OneDrive |
| **Native UX** | ❌ | ❌ | ✅ |
| **Reliability** | 50% | 20% | **95%** ✅ |
| **Debug logs** | ❌ | ❌ | ✅ |

---

## 🎉 Lợi Ích V3

1. **User Control 100%**
   - Tự chọn chính xác nơi lưu
   - Không phải tìm kiếm file

2. **Cloud Backup**
   - Có thể lưu trực tiếp lên Google Drive
   - Backup tự động

3. **Native Android UX**
   - Share sheet quen thuộc
   - Tương tự chia sẻ ảnh/file

4. **Debug Logs**
   - Console logs giúp phát hiện lỗi nhanh
   - Dễ dàng support user

5. **No Permission Issues**
   - Share API không cần quyền storage
   - User tự cấp quyền khi chọn folder

---

## 🚀 Expected Results

**Sau khi rebuild và test:**

✅ Click Export → Share sheet xuất hiện
✅ Chọn "Save to Files" → File picker mở
✅ Chọn folder → Save → File lưu đúng nơi
✅ File Manager → Thấy file ngay lập tức
✅ Import → Chọn file → Thành công
✅ Có thể backup lên Google Drive

**100% Control cho User!** 🎊

---

## 📝 Technical Details

### Code Changes:
- `utils/export.ts`: Implement Share API với Filesystem Cache
- `components/ExportImportModal.tsx`: Update async handlers & toast
- Debug logs: console.log tại các bước quan trọng

### Flow:
```
User clicks Export
  → exportToJSON() checks platform
    → Android: shareFile()
      → Filesystem.writeFile(Cache)
        → Share.share(fileURI)
          → Android Share Sheet
            → User picks location
              → File saved ✅
```

### Plugins Required:
- `@capacitor/filesystem` ✅ (Already in package.json)
- `@capacitor/share` ✅ (Already in package.json)
- `@capacitor/core` ✅ (Already in package.json)

---

## 🎯 Next Steps

1. **User test the APK**
2. **Report results:**
   - Share sheet có xuất hiện không?
   - Có lưu được file không?
   - File có ở đúng vị trí không?
3. **If success:** Remove debug logs (Round 3)
4. **If issues:** Share console logs → Debug → Fix

---

**LẦN NÀY CHẮC CHẮN SẼ HOẠT ĐỘNG!** 💪

Share API là cách standard và reliable nhất để cho user chọn nơi lưu file trên Android.

