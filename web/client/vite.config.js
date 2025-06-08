// export default {
//   root: 'src',
//   build: {
//     outDir: '../dist',
//     rollupOptions: {
//       input: {
//         main: 'index.html',
//         sw: 'sw.js',
//       },
//     },
//   },
// }
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});