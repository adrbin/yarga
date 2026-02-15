import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    proxy: {
      '/api/reddit': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/reddit/, '')
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'YARGA',
        short_name: 'YARGA',
        description: 'YARGA (Yet Another Reddit Gallery App)',
        start_url: '/',
        display: 'standalone',
        background_color: '#0B0D12',
        theme_color: '#0B0D12',
        icons: [
          {
            src: '/pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    css: true
  }
});
