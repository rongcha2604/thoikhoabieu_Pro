# 🔧 Fix Lỗi Rollup Native Modules trên Vercel - Giải Pháp Cuối Cùng

## ❌ Vấn Đề

Lỗi `MODULE_NOT_FOUND` với rollup native modules trên Vercel vẫn tiếp tục:
```
requireStack: [ '/vercel/path0/node_modules/rollup/dist/native.js' ]
```

## 🔍 Nguyên Nhân Đã Phát Hiện

1. **Version Mismatch:** 
   - package.json: vite `^5.4.0`
   - Local: vite `7.2.2`
   - Conflict giữa các version

2. **Rollup Version Conflicts:**
   - vite-plugin-pwa dùng rollup `2.79.2` (cũ)
   - vite dùng rollup `4.53.1` (mới)
   - Native modules không tương thích

3. **Vercel Node Version:**
   - Có thể vẫn dùng Node 22.x
   - Cần verify trong Dashboard

## ✅ Giải Pháp Đã Áp Dụng

### **1. Update Dependencies**
- ✅ Update vite: `^5.4.11` (stable, tương thích tốt)
- ✅ Thêm rollup: `^4.53.1` (đồng bộ với vite)
- ✅ Update @types/node: `^20.0.0` (phù hợp với Node 20)
- ✅ Removed vite-plugin-pwa (đã disable trong config, tránh conflicts)

### **2. Force Rebuild Native Modules**
- ✅ Thêm `postinstall` script: rebuild rollup
- ✅ Update installCommand: `--force` và rebuild rollup
- ✅ Đảm bảo native modules được build đúng platform

### **3. Verify Node Version**
- ✅ `.nvmrc`: 20
- ✅ `.node-version`: 20
- ✅ `package.json` engines: `20.x`
- ⚠️ **QUAN TRỌNG:** Phải set trong Vercel Dashboard!

## 🚀 Các Bước Deploy

### **Bước 1: Verify Vercel Dashboard**

**BẮT BUỘC - KHÔNG BỎ QUA:**

1. Vào https://vercel.com/dashboard
2. Chọn project
3. Settings → General
4. Tìm "Node.js Version"
5. Chọn **"20.x"**
6. Click **"Save"**

### **Bước 2: Commit và Push**

```bash
git add .
git commit -m "fix: update vite/rollup versions và force rebuild native modules"
git push
```

### **Bước 3: Redeploy**

1. Vào Vercel Dashboard
2. Deployments → Redeploy
3. Hoặc Vercel tự động deploy khi push

### **Bước 4: Kiểm Tra Build Logs**

**PHẢI verify:**
- Node version: `Node.js v20.x.x` (KHÔNG PHẢI 22.x)
- Install: `npm install --legacy-peer-deps --force`
- Rebuild: `npm rebuild rollup --force`
- Build: `vite build` thành công

## 🔄 Giải Pháp Alternative (Nếu Vẫn Lỗi)

### **Option 1: Dùng npm ci thay vì npm install**

Sửa `vercel.json`:
```json
{
  "installCommand": "npm ci --legacy-peer-deps --force && npm rebuild rollup --force || true"
}
```

### **Option 2: Dùng Yarn (Nếu có)**

```json
{
  "installCommand": "yarn install --frozen-lockfile && yarn rebuild rollup || true"
}
```

### **Option 3: Pre-build Native Modules**

Tạo script `prebuild.sh`:
```bash
#!/bin/bash
npm install --legacy-peer-deps --force
npm rebuild rollup --force
npm run build
```

### **Option 4: Dùng Docker Build (Advanced)**

Tạo `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --force
RUN npm rebuild rollup --force
COPY . .
RUN npm run build
```

### **Option 5: Disable Rollup Native (Last Resort)**

Nếu vẫn không được, có thể thử disable rollup native và dùng JS version:
- Set env: `ROLLUP_NATIVE=false`
- Hoặc dùng esbuild plugin thay vì rollup

## 📋 Checklist

- [ ] Đã update vite: `^5.4.11`
- [ ] Đã thêm rollup: `^4.53.1`
- [ ] Đã update @types/node: `^20.0.0`
- [ ] Đã thêm postinstall script
- [ ] Đã update installCommand với --force và rebuild
- [ ] **ĐÃ SET NODE VERSION TRONG VERCEL DASHBOARD: 20.x** ⚠️
- [ ] Đã commit và push
- [ ] Đã redeploy
- [ ] Đã kiểm tra build logs (Node 20.x)
- [ ] Build thành công

## 🔍 Debug Steps

Nếu vẫn lỗi:

1. **Kiểm tra Build Logs:**
   - Node version là gì? (phải là 20.x)
   - Install có thành công không?
   - Rebuild rollup có chạy không?
   - Lỗi cụ thể ở đâu?

2. **Kiểm tra Vercel Settings:**
   - Node.js Version = 20.x?
   - Environment Variables có gì?
   - Build Command có đúng không?

3. **Test Local:**
   ```bash
   # Test với Node 20
   node --version  # Phải là v20.x.x
   npm install --legacy-peer-deps --force
   npm rebuild rollup --force
   npm run build
   ```

4. **Verify Dependencies:**
   ```bash
   npm list vite rollup
   # Phải không có conflicts
   ```

## 🎯 Kết Quả Mong Đợi

Sau khi fix:
- ✅ Node version: 20.x (verified trong build logs)
- ✅ Vite version: 5.4.11
- ✅ Rollup version: 4.53.1 (no conflicts)
- ✅ Native modules: Rebuilt successfully
- ✅ Build: Thành công
- ✅ Deployment: Thành công

## 📞 Nếu Vẫn Không Được

**Liên hệ support hoặc thử:**
1. Xóa và tạo lại project trên Vercel
2. Dùng Vercel CLI để deploy
3. Deploy lên platform khác (Netlify, Railway, etc.)
4. Dùng Docker build và deploy

---

**⚠️ LƯU Ý QUAN TRỌNG:**
**BẮT BUỘC phải set Node version = "20.x" trong Vercel Dashboard!**
**Đây là bước QUAN TRỌNG NHẤT!**

