# 🚀 Hướng Dẫn Push Code Lên GitHub

## 📋 Bước 1: Tạo Repository Trên GitHub

1. **Đăng nhập GitHub:**
   - Vào https://github.com
   - Đăng nhập vào tài khoản của bạn

2. **Tạo repository mới:**
   - Click nút **"New"** hoặc **"+"** → **"New repository"**
   - Điền thông tin:
     - **Repository name:** `ThoiKhoaBieuPRO-PWA` (hoặc tên bạn muốn)
     - **Description:** `Ứng dụng quản lý thời khóa biểu PWA`
     - **Visibility:** Chọn **Public** (công khai) hoặc **Private** (riêng tư)
     - **⚠️ QUAN TRỌNG:** KHÔNG tích "Initialize with README" (vì project đã có code rồi)
   - Click **"Create repository"**

3. **Copy URL repository:**
   - Sau khi tạo xong, GitHub sẽ hiển thị URL
   - Copy URL (ví dụ: `https://github.com/username/ThoiKhoaBieuPRO-PWA.git`)

---

## 📋 Bước 2: Push Code Lên GitHub

### **Cách 1: Dùng Script Tự Động (Khuyến nghị - Dễ nhất)**

1. **Chạy script:**
   - Double-click vào file `push-to-github.bat`
   - Script sẽ tự động:
     - Kiểm tra git đã cài chưa
     - Khởi tạo git repository (nếu chưa có)
     - Hỏi URL repository GitHub
     - Add files
     - Commit
     - Push lên GitHub

2. **Làm theo hướng dẫn:**
   - Nhập URL repository khi được hỏi
   - Chọn Y để add tất cả files
   - Nhập commit message (hoặc Enter để dùng mặc định)
   - Chọn tên branch (mặc định: main)

3. **Hoàn thành!**
   - Code đã được push lên GitHub thành công!

### **Cách 2: Dùng Lệnh Thủ Công**

#### **2.1. Mở Terminal trong thư mục project:**
- Mở CMD hoặc PowerShell
- Chuyển vào thư mục project:
  ```bash
  cd "d:\HocTapLTHT\Dự án đã hoàn tất\ThoiKhoaBieuPRO-PWA"
  ```

#### **2.2. Khởi tạo Git (nếu chưa có):**
```bash
git init
```

#### **2.3. Thêm remote repository:**
```bash
git remote add origin https://github.com/username/ThoiKhoaBieuPRO-PWA.git
```
⚠️ **Thay `username` bằng tên GitHub của bạn!**

#### **2.4. Config Git (nếu chưa config):**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### **2.5. Add files:**
```bash
git add .
```

#### **2.6. Commit:**
```bash
git commit -m "feat: initial commit - Thời khóa biểu PRO PWA"
```

#### **2.7. Push lên GitHub:**
```bash
git branch -M main
git push -u origin main
```

---

## 📋 Bước 3: Kiểm Tra

1. **Vào GitHub:**
   - Vào URL repository: `https://github.com/username/ThoiKhoaBieuPRO-PWA`
   - Kiểm tra code đã được push lên chưa

2. **Verify:**
   - Tất cả files đã có trên GitHub
   - README.md hiển thị đúng
   - Không có node_modules, dist, build files (đã được ignore)

---

## ❓ Xử Lý Lỗi

### **Lỗi: "remote origin already exists"**
```bash
# Xóa remote cũ
git remote remove origin

# Thêm remote mới
git remote add origin https://github.com/username/ThoiKhoaBieuPRO-PWA.git
```

### **Lỗi: "Authentication failed"**
- **Cách 1:** Dùng Personal Access Token
  1. Vào GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token
  3. Copy token
  4. Khi push, nhập token thay vì password

- **Cách 2:** Dùng GitHub CLI
  ```bash
  gh auth login
  ```

### **Lỗi: "failed to push some refs"**
```bash
# Pull trước (nếu repository đã có files)
git pull origin main --allow-unrelated-histories

# Sau đó push lại
git push -u origin main
```

### **Lỗi: "git config user.name/user.email"**
```bash
# Config git user
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 📝 Lưu Ý

1. **Files đã được ignore:**
   - `node_modules/` - Dependencies
   - `dist/` - Build files
   - `android/app/build/` - Android build files
   - `.env.local` - Environment variables
   - `*.log` - Log files

2. **Files sẽ được push:**
   - Source code (`.tsx`, `.ts`, `.css`, etc.)
   - Config files (`package.json`, `tsconfig.json`, etc.)
   - Documentation (`README.md`, `*.md`)
   - Public assets (`public/`)

3. **Sau khi push:**
   - Code đã được lưu trên GitHub
   - Có thể clone về máy khác
   - Có thể chia sẻ với người khác
   - Có thể deploy từ GitHub

---

## 🎯 Kết Quả

Sau khi hoàn thành, bạn sẽ có:
- ✅ Repository trên GitHub
- ✅ Code đã được push lên GitHub
- ✅ Có thể xem code online
- ✅ Có thể clone về máy khác
- ✅ Có thể deploy từ GitHub

---

## 📚 Tài Liệu Tham Khảo

- [GitHub Docs](https://docs.github.com/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub CLI](https://cli.github.com/)

---

**Chúc bạn thành công! 🎉**

