# PWA Icons Setup

## Icons cần thiết

Để PWA hoạt động đầy đủ, bạn cần tạo các icons sau trong thư mục `public/`:

1. **icon-192x192.png** (192x192 pixels)
2. **icon-512x512.png** (512x512 pixels)
3. **apple-touch-icon.png** (180x180 pixels)
4. **favicon.ico** (32x32 pixels, hoặc 16x16, 32x32, 48x48)

## Cách tạo icons

### Option 1: Sử dụng RealFaviconGenerator (Khuyến nghị)
1. Truy cập: https://realfavicongenerator.net/
2. Upload logo/icon của bạn
3. Download và extract vào thư mục `public/`

### Option 2: Copy từ Android launcher icon
Nếu bạn đã có Android launcher icons:
1. Copy `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` → `public/icon-512x512.png`
2. Copy `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` → `public/icon-192x192.png`
3. Copy `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` → `public/apple-touch-icon.png`
4. Tạo favicon.ico từ icon (có thể dùng tool online)

### Option 3: Tạo icon đơn giản
1. Tạo icon với text "TKB" hoặc logo của bạn
2. Resize thành các kích thước cần thiết
3. Lưu vào thư mục `public/`

## Temporary Placeholder

Hiện tại app sẽ hoạt động với icons placeholder. Để có trải nghiệm tốt nhất, hãy tạo icons chuyên nghiệp.

## Test PWA

Sau khi có icons, test PWA bằng cách:
1. Build app: `npm run build`
2. Preview: `npm run preview`
3. Mở Chrome DevTools → Application → Manifest
4. Kiểm tra icons hiển thị đúng
5. Test "Add to Home Screen" trên mobile

