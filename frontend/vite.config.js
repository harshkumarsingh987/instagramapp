import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ✅ Allow both localhost (for development) and your Render domain
    allowedHosts: [
      'localhost',
      'instagramapp-1-lghe.onrender.com', // <-- your Render frontend URL
    ],
    port: 5173, // Default Vite port
    // Optional: Proxy API calls during development
    proxy: {
      '/api': {
        target: 'https://instagramapp-ygyz.onrender.com', // <-- your backend Render URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
