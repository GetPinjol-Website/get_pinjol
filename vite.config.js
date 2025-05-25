import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';

  export default defineConfig({
      plugins: [react()],
      server: {
          port: 3001, // Gunakan port berbeda dari Back-End (3000)
          open: true
      },
      build: {
          outDir: 'dist' // Direktori output untuk build
      }
  });