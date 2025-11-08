# 🔧 Fix Lỗi Vercel: Rollup Native Modules - Node Version

## ❌ Vấn Đề

Vercel vẫn đang dùng Node.js v22.x mặc dù đã có `.nvmrc` và `engines`. Lỗi:
```
MODULE_NOT_FOUND
requireStack: [ '/vercel/path0/node_modules/rollup/dist/native.js' ]
```

## ✅ Giải Pháp: Set Node Version Trong Vercel Dashboard

### **Bước 1: Vào Vercel Dashboard**

1. Đăng nhập Vercel: https://vercel.com/dashboard
2. Chọn project của bạn
3. Vào **Settings** → **General**

### **Bước 2: Set Node.js Version**

1. Tìm section **"Node.js Version"**
2. Chọn **"20.x"** (hoặc **"20"**)
3. Click **"Save"**

### **Bước 3: Redeploy**

1. Vào **Deployments**
2. Click vào deployment mới nhất
3. Click **"Redeploy"** (3 dots menu → Redeploy)
4. Hoặc push code mới lên GitHub

### **Bước 4: Verify**

1. Xem build logs
2. Kiểm tra dòng đầu tiên: `Node.js v20.x.x` (không phải v22.x)
3. Build phải thành công

## 📋 Files Đã Cấu Hình

### **1. `.nvmrc`**
```
20
```

### **2. `.node-version`**
```
20
```

### **3. `package.json` engines**
```json
{
  "engines": {
    "node": "20.x",
    "npm": ">=9.0.0"
  }
}
```

### **4. `vercel.json`**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "vite"
}
```

## 🚨 Quan Trọng

**Vercel KHÔNG tự động đọc `.nvmrc` trong một số trường hợp!**

**BẮT BUỘC phải set Node version trong Vercel Dashboard:**
- Vào **Settings** → **General** → **Node.js Version**
- Chọn **"20.x"**
- **Save**

## 🔄 Nếu Vẫn Lỗi

### **Giải pháp 1: Update Vite Version**

Có thể vite version cũ không tương thích. Thử update:

```bash
npm install vite@latest --save-dev
```

### **Giải pháp 2: Xóa và Tạo Lại Project**

1. Xóa project trên Vercel
2. Tạo lại project mới
3. Set Node version ngay từ đầu: **20.x**

### **Giải pháp 3: Dùng Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Set Node version
vercel env add NODE_VERSION
# Nhập: 20

# Deploy
vercel --prod
```

## 📝 Checklist

- [ ] Đã tạo `.nvmrc` với `20`
- [ ] Đã tạo `.node-version` với `20`
- [ ] Đã set `engines.node: "20.x"` trong `package.json`
- [ ] **Đã set Node version trong Vercel Dashboard: 20.x** ⚠️ QUAN TRỌNG
- [ ] Đã commit và push code
- [ ] Đã redeploy trên Vercel
- [ ] Đã verify Node version trong build logs (phải là 20.x)

## 🎯 Kết Quả

Sau khi set Node version trong Vercel Dashboard:
- ✅ Build logs hiển thị: `Node.js v20.x.x`
- ✅ Không còn lỗi `MODULE_NOT_FOUND`
- ✅ Build thành công
- ✅ Deployment thành công

---

**⚠️ LƯU Ý QUAN TRỌNG:**
**Bạn PHẢI set Node version trong Vercel Dashboard!**
**Chỉ có `.nvmrc` và `engines` KHÔNG ĐỦ trong một số trường hợp!**

