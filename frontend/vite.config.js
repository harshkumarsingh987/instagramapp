import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['*'], // ✅ allow all hosts (safe for deployed builds)
    host: true,          // ✅ listen on all network interfaces
    port: 5173,
  },
  preview: {
    allowedHosts: ['*'], // ✅ ensure preview mode also works on Render
  },
});
