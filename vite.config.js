import { defineConfig } from 'vite';
import gzip from 'vite-plugin-compression';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/lv1_hanzi/' : '/',
  publicDir: 'public',
  build: {
    target: 'esnext',
  },
  plugins: [
    gzip({
      filter: /\.(js|mjs|json|css|html|sqlite3|wasm)$/i,
    }),
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['@sqlite.org/sqlite-wasm'],
  },
});
