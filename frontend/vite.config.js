import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // same as 0.0.0.0
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    allowedHosts: [
      "instagramapp-1-mm3x.onrender.com" // your Render domain
    ]
  }
});
