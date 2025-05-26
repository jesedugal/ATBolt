import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Ensure the app listens on all interfaces
    host: '0.0.0.0', 
    
    // Use the port Render sets, if available (via the $PORT environment variable)
    port: process.env.PORT || 80,  // Render sets the $PORT variable
  },
});

