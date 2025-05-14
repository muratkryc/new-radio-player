import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/radio-image': {
        target: 'https://radyo.medyahost.com.tr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/radio-image/, ''),
      },
    },
  },
});
