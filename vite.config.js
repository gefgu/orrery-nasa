import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // Optional but recommended
    port: 3000,        // Use a different port (e.g., 3000)
  },
  cors: true, // Allow cross-origin requests (you can customize this further if needed)
  base: '/orrery-nasa/',
  build: {
    outDir: 'dist',        // Output directory for both React app and static assets
    rollupOptions: {
      input: {
        main: './index.html',       // Entry point for React app
        webapp: './/webapp.html'  // Entry point for webapp.html
      }
    }
  }
});

