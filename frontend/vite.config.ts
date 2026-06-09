import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allows importing from @/components/... instead of ../../../components/...
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    // Proxy API calls to the local backend during development.
    // In production, the frontend calls the Render URL directly via VITE_API_URL.
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
