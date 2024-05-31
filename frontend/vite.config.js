import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://xtube-api.onrender.com',
    },
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // Adjust this to your source directory if different
    }
  },
  // optimizeDeps: {
  //   exclude: ['@mapbox/node-pre-gyp', 'mock-aws-s3', 'aws-sdk', 'nock'],
  // },
});
