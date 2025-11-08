# 🔧 Hướng Dẫn Fix Lỗi Vercel Deploy

## ❌ Lỗi Gặp Phải

```
Error: MODULE_NOT_FOUND
requireStack: [ '/vercel/path0/node_modules/rollup/dist/native.js' ]
Node.js v22.21.1
Error: Command "npm run build" exited with 1
```

## 🔍 Nguyên Nhân

1. **Node.js version không tương thích:** Vercel đang dùng Node.js v22.21.1, nhưng rollup native modules có thể chưa tương thích
2. **Native modules không được build:** Rollup native bindings không được build đúng trên Vercel
3. **Dependencies không được install đúng:** Có thể thiếu dependencies hoặc install không đúng cách

## ✅ Giải Pháp Đã Áp Dụng

### 1. **Tạo `vercel.json`**
- Cấu hình install command: `npm install --legacy-peer-deps`
- Cấu hình build command: `npm run build`
- Cấu hình output directory: `dist`
- ⚠️ **Lưu ý:** KHÔNG dùng `nodeVersion` trong vercel.json (không hợp lệ)
- ✅ Vercel sẽ tự detect Node version từ `.nvmrc` hoặc `package.json` engines

### 2. **Cập Nhật `package.json`**
- Thêm `engines` để chỉ định Node version: `>=18.0.0 <=20.x`
- Thêm script `vercel-build`: `vite build`
- Đảm bảo dependencies đúng

### 3. **Tạo `.nvmrc`**
- Chỉ định Node version: `20`
- Giúp Vercel biết cần dùng Node version nào

## 🚀 Các Bước Deploy Lại

### **Bước 1: Commit các thay đổi**

```bash
git add .
git commit -m "fix: cấu hình Vercel deploy - sửa lỗi rollup native modules"
git push
```

### **Bước 2: Deploy lại trên Vercel**

1. **Vào Vercel Dashboard:**
   - Vào https://vercel.com/dashboard
   - Chọn project của bạn

2. **Redeploy:**
   - Click vào project
   - Click **"Redeploy"** hoặc **"Deployments"** → **"Redeploy"**
   - Hoặc push code mới lên GitHub (Vercel sẽ tự động deploy)

3. **Kiểm tra Build Logs:**
   - Xem build logs để đảm bảo không còn lỗi
   - Kiểm tra Node version (phải là 20.x, không phải 22.x)

### **Bước 3: Verify Deployment**

- Kiểm tra URL deployment
- Test ứng dụng hoạt động đúng
- Kiểm tra console không có lỗi

## 🔍 Kiểm Tra Cấu Hình

### **1. Kiểm tra `vercel.json`:**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "vite"
}
```
⚠️ **Lưu ý:** KHÔNG dùng `nodeVersion` trong vercel.json (sẽ báo lỗi "Invalid request")

### **2. Kiểm tra `package.json`:**
```json
{
  "engines": {
    "node": ">=18.0.0 <=20.x",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "vercel-build": "vite build"
  }
}
```

### **3. Kiểm tra `.nvmrc`:**
```
20
```

## ❓ Xử Lý Lỗi Khác

### **Lỗi: "npm ci failed"**
```bash
# Thử dùng npm install thay vì npm ci
# Sửa vercel.json:
"installCommand": "npm install --legacy-peer-deps"
```

### **Lỗi: "Build failed - vite build"**
```bash
# Kiểm tra build logs trên Vercel
# Kiểm tra xem có lỗi TypeScript không
# Kiểm tra xem có thiếu dependencies không
```

### **Lỗi: "Module not found - vite"**
```bash
# Đảm bảo vite trong devDependencies
# Chạy: npm install --legacy-peer-deps
# Commit và push lại
```

### **Lỗi: "Node version mismatch"**
```bash
# Kiểm tra vercel.json có đúng nodeVersion: "20.x"
# Kiểm tra .nvmrc có đúng "20"
# Kiểm tra package.json engines có đúng "<=20.x"
```

## 📝 Lưu Ý

1. **Node Version:**
   - ✅ Dùng Node.js 20.x (stable, tương thích tốt)
   - ❌ Không dùng Node.js 22.x (có thể có vấn đề với native modules)

2. **Install Command:**
   - ✅ Dùng `npm ci --legacy-peer-deps` (clean install, tránh peer dependency conflicts)
   - ❌ Không dùng `npm install` (có thể install sai version)

3. **Build Command:**
   - ✅ Dùng `npm ci && npm run build` (clean install trước khi build)
   - ❌ Không dùng `npm run build` (có thể thiếu dependencies)

4. **Output Directory:**
   - ✅ Phải là `dist` (theo Vite config)
   - ❌ Không phải `build` hoặc `out`

## 🎯 Kết Quả Mong Đợi

Sau khi fix:
- ✅ Build thành công trên Vercel
- ✅ Không còn lỗi MODULE_NOT_FOUND
- ✅ Node version đúng (20.x)
- ✅ Deployment thành công
- ✅ Ứng dụng hoạt động đúng

## 📚 Tài Liệu Tham Khảo

- [Vercel Node.js Runtime](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js)
- [Vercel Build Configuration](https://vercel.com/docs/build-step)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)

---

**Chúc bạn deploy thành công! 🚀**

