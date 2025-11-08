# PWA Setup Guide - Thời Khóa Biểu PRO

## ✅ Đã hoàn thành

1. ✅ Cài đặt `vite-plugin-pwa`
2. ✅ Cấu hình `vite.config.ts` với PWA plugin
3. ✅ Tạo `manifest.json`
4. ✅ Cập nhật `index.html` với PWA meta tags
5. ✅ Tạo icon SVG placeholder

## 📝 Cần làm thêm

### 1. Tạo Icons PNG

Hiện tại chỉ có icon SVG placeholder. Để PWA hoạt động đầy đủ, bạn cần tạo các icons PNG:

- `public/icon-192x192.png` (192x192 pixels)
- `public/icon-512x512.png` (512x512 pixels)
- `public/apple-touch-icon.png` (180x180 pixels)
- `public/favicon.ico` (32x32 pixels)

**Cách tạo icons:**

1. **Option 1: Sử dụng RealFaviconGenerator (Khuyến nghị)**
   - Truy cập: https://realfavicongenerator.net/
   - Upload `public/icon.svg` hoặc logo của bạn
   - Download và extract vào thư mục `public/`

2. **Option 2: Copy từ Android launcher icon**
   ```bash
   # Copy từ Android icon (nếu có)
   cp android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png public/icon-512x512.png
   cp android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png public/icon-192x192.png
   cp android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png public/apple-touch-icon.png
   ```

3. **Option 3: Sử dụng ImageMagick hoặc tool khác**
   ```bash
   # Convert SVG sang PNG (nếu có ImageMagick)
   convert public/icon.svg -resize 512x512 public/icon-512x512.png
   convert public/icon.svg -resize 192x192 public/icon-192x192.png
   convert public/icon.svg -resize 180x180 public/apple-touch-icon.png
   ```

### 2. Test PWA

Sau khi có icons, test PWA:

```bash
# Build app
npm run build

# Preview
npm run preview

# Hoặc dev mode (PWA cũng hoạt động trong dev mode)
npm run dev
```

**Test trên Chrome DevTools:**
1. Mở Chrome DevTools (F12)
2. Vào tab **Application**
3. Kiểm tra:
   - **Manifest**: Xem manifest.json hiển thị đúng
   - **Service Workers**: Xem service worker đã register
   - **Cache Storage**: Xem cache đã tạo
4. Test "Add to Home Screen":
   - Click icon "Install" trong address bar
   - Hoặc vào Application → Manifest → "Add to homescreen"

**Test trên mobile:**
1. Deploy app lên server (HTTPS required cho production)
2. Mở trên mobile browser
3. Click "Add to Home Screen"
4. Verify app hoạt động offline

## 🔧 Cấu hình PWA

### Service Worker
- **Auto-update**: Service worker tự động update khi có version mới
- **Caching Strategy**:
  - Assets (JS, CSS, images): CacheFirst (cache lâu dài)
  - Google Fonts: CacheFirst (1 năm)
  - Tailwind CDN: NetworkFirst (1 ngày)

### Manifest
- **Name**: "Thời Khóa Biểu PRO"
- **Short Name**: "TKB PRO"
- **Theme Color**: #3b82f6 (màu xanh primary)
- **Display**: standalone (app-like experience)
- **Orientation**: portrait

## 🚀 Deployment

PWA yêu cầu HTTPS để hoạt động (trừ localhost):
- **Development**: localhost OK
- **Production**: Cần HTTPS

## 📚 Tài liệu tham khảo

- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Web App Manifest](https://web.dev/add-manifest/)
- [Service Workers](https://web.dev/service-workers-cache-storage/)

## ❓ Troubleshooting

### Icons không hiển thị
- Kiểm tra icons có trong thư mục `public/` không
- Kiểm tra đường dẫn trong `manifest.json` đúng không
- Clear cache và reload

### Service Worker không register
- Kiểm tra HTTPS (production)
- Kiểm tra console có lỗi không
- Clear service workers cũ: Application → Service Workers → Unregister

### PWA không install được
- Kiểm tra manifest.json hợp lệ
- Kiểm tra icons có đủ sizes không
- Kiểm tra HTTPS (production)

## ✅ Checklist

- [x] Cài đặt vite-plugin-pwa
- [x] Cấu hình vite.config.ts
- [x] Tạo manifest.json
- [x] Cập nhật index.html
- [ ] Tạo icons PNG (192x192, 512x512, apple-touch-icon, favicon)
- [ ] Test PWA trên dev server
- [ ] Test PWA trên mobile
- [ ] Deploy lên production (HTTPS)

