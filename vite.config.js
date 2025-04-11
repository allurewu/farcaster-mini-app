import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    assetsDir: 'assets',
    manifest: true
  },
  base: '/farcaster-mini-app/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}); 