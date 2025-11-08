import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa'; // Temporarily disabled - package not installing

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 7000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        // VitePWA plugin temporarily disabled - use manual PWA setup
        // See public/sw.js for manual service worker implementation
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'chart-vendor': ['chart.js', 'react-chartjs-2'],
              'motion-vendor': ['framer-motion'],
              'utils': ['idb'],
            },
          },
        },
        chunkSizeWarningLimit: 600,
      },
    };
});
