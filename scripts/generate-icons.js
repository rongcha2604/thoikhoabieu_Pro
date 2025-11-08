// Script to generate PWA icons from Android launcher icons
// This script copies Android launcher icons to public folder for PWA

const fs = require('fs');
const path = require('path');

const androidIconPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'mipmap-xxxhdpi', 'ic_launcher.png');
const publicPath = path.join(__dirname, '..', 'public');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

// Copy Android icon to PWA icons
if (fs.existsSync(androidIconPath)) {
  // Copy as 512x512 (largest size)
  fs.copyFileSync(androidIconPath, path.join(publicPath, 'icon-512x512.png'));
  console.log('✓ Copied icon-512x512.png');
  
  // Copy as 192x192 (standard size)
  fs.copyFileSync(androidIconPath, path.join(publicPath, 'icon-192x192.png'));
  console.log('✓ Copied icon-192x192.png');
  
  // Copy as apple-touch-icon (180x180)
  fs.copyFileSync(androidIconPath, path.join(publicPath, 'apple-touch-icon.png'));
  console.log('✓ Copied apple-touch-icon.png');
  
  // Copy as favicon (will need to convert to .ico, but for now use PNG)
  fs.copyFileSync(androidIconPath, path.join(publicPath, 'favicon.ico'));
  console.log('✓ Copied favicon.ico (PNG format)');
  
  console.log('\n✅ Icons generated successfully!');
  console.log('Note: For production, you may want to optimize these icons or create custom ones.');
} else {
  console.error('❌ Android launcher icon not found at:', androidIconPath);
  console.log('\n📝 Creating placeholder icons...');
  
  // Create a simple placeholder SVG icon
  const svgIcon = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#3b82f6"/>
    <text x="256" y="280" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="white" text-anchor="middle">TKB</text>
  </svg>`;
  
  // Note: This is SVG, not PNG. For actual PNG icons, you'll need to:
  // 1. Use an online tool like https://realfavicongenerator.net/
  // 2. Use ImageMagick or similar tool
  // 3. Create icons manually from your logo
  
  console.log('⚠️  Please create PWA icons manually:');
  console.log('   1. Create icon-192x192.png (192x192px)');
  console.log('   2. Create icon-512x512.png (512x512px)');
  console.log('   3. Create apple-touch-icon.png (180x180px)');
  console.log('   4. Create favicon.ico (32x32px)');
  console.log('\n   You can use: https://realfavicongenerator.net/');
}

