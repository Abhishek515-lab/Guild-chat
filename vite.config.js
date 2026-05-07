import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // --- Yeh naya section add karein ---
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Badi libraries ko specific groups mein daal dein
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react', '@radix-ui/react-slot'], // jo bhi UI libs hain
          'vendor-utils': ['axios', 'socket.io-client'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});