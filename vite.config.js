import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // Optional but recommended
    port: 3000,        // Use a different port (e.g., 3000)
  },
  cors: true, // Allow cross-origin requests (you can customize this further if needed)
  base: '/orrery-nasa/',
});

