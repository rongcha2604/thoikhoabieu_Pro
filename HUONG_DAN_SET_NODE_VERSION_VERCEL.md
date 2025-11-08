# 🚀 Hướng Dẫn Set Node Version Trong Vercel Dashboard

## ⚠️ QUAN TRỌNG

**Vercel KHÔNG tự động đọc `.nvmrc` trong một số trường hợp!**

**BẮT BUỘC phải set Node version trong Vercel Dashboard để fix lỗi rollup native modules!**

## 📋 Các Bước Chi Tiết

### **Bước 1: Đăng Nhập Vercel**

1. Vào https://vercel.com
2. Đăng nhập vào tài khoản của bạn

### **Bước 2: Chọn Project**

1. Vào **Dashboard**
2. Tìm và click vào project **"ThoiKhoaBieuPRO-PWA"** (hoặc tên project của bạn)

### **Bước 3: Vào Settings**

1. Click tab **"Settings"** (ở menu trên)
2. Click **"General"** (ở menu bên trái)

### **Bước 4: Set Node.js Version**

1. Tìm section **"Node.js Version"** (scroll xuống)
2. Bạn sẽ thấy dropdown với các options:
   - `18.x`
   - `20.x` ← **CHỌN CÁI NÀY**
   - `22.x`
   - `Latest`
3. Chọn **"20.x"**
4. Click **"Save"** (nút ở dưới cùng)

### **Bước 5: Redeploy**

1. Vào tab **"Deployments"**
2. Click vào deployment mới nhất
3. Click menu **"..."** (3 dots) ở góc trên bên phải
4. Chọn **"Redeploy"**
5. Xác nhận **"Redeploy"**

### **Bước 6: Kiểm Tra Build Logs**

1. Đợi build chạy
2. Click vào build để xem logs
3. Kiểm tra dòng đầu tiên:
   - ✅ **ĐÚNG:** `Node.js v20.x.x`
   - ❌ **SAI:** `Node.js v22.x.x` (nếu vẫn là 22.x, kiểm tra lại settings)

### **Bước 7: Verify**

1. Build phải thành công (không còn lỗi `MODULE_NOT_FOUND`)
2. Deployment phải thành công
3. Ứng dụng phải chạy đúng

## 📸 Hình Ảnh Minh Họa (Text-based)

```
Vercel Dashboard
├── Project: ThoiKhoaBieuPRO-PWA
│   ├── Overview
│   ├── Deployments
│   ├── Settings ← CLICK VÀO ĐÂY
│   │   ├── General ← CLICK VÀO ĐÂY
│   │   │   ├── Project Name
│   │   │   ├── Framework Preset
│   │   │   ├── ...
│   │   │   └── Node.js Version ← TÌM SECTION NÀY
│   │   │       └── Dropdown: [20.x] ← CHỌN "20.x"
│   │   │           └── [Save] ← CLICK SAVE
│   │   ├── Environment Variables
│   │   └── ...
│   └── ...
```

## 🔍 Kiểm Tra Node Version Trong Build Logs

Sau khi redeploy, build logs sẽ hiển thị:

```
> Building...
Node.js v20.x.x  ← PHẢI LÀ 20.x, KHÔNG PHẢI 22.x
npm install --legacy-peer-deps
...
> vite build
...
✓ built in Xs
```

## ❓ FAQ

### **Q: Tại sao phải set trong Dashboard?**
**A:** Vercel không luôn tự động đọc `.nvmrc` hoặc `engines`. Set trong Dashboard đảm bảo Vercel dùng đúng Node version.

### **Q: Đã set trong Dashboard nhưng vẫn lỗi?**
**A:** 
1. Kiểm tra lại đã save chưa
2. Kiểm tra đã redeploy chưa
3. Kiểm tra build logs xem Node version có đúng không
4. Thử xóa và tạo lại project

### **Q: Có cách nào khác không?**
**A:** 
- Có thể dùng Vercel CLI: `vercel env add NODE_VERSION` → nhập `20`
- Nhưng cách dễ nhất vẫn là set trong Dashboard

## 🎯 Kết Quả

Sau khi set Node version trong Dashboard:
- ✅ Build logs hiển thị: `Node.js v20.x.x`
- ✅ Không còn lỗi `MODULE_NOT_FOUND`
- ✅ Rollup native modules hoạt động đúng
- ✅ Build thành công
- ✅ Deployment thành công

## 📝 Checklist

- [ ] Đã vào Vercel Dashboard
- [ ] Đã chọn project
- [ ] Đã vào Settings → General
- [ ] Đã tìm section "Node.js Version"
- [ ] Đã chọn "20.x"
- [ ] Đã click "Save"
- [ ] Đã redeploy
- [ ] Đã kiểm tra build logs (Node version = 20.x)
- [ ] Build thành công
- [ ] Deployment thành công

---

**⚠️ LƯU Ý:**
**Đây là bước QUAN TRỌNG NHẤT để fix lỗi rollup native modules!**
**Không bỏ qua bước này!**

