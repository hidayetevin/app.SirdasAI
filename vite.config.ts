/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    minify: 'terser',
  },
  server: {
    host: true,
  },
  test: {
    environment: 'jsdom',
    passWithNoTests: true,
    globals: true
  }
});
