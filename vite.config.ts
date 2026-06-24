import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/asir_maaeed/' : '/',
  envPrefix: ['VITE_', 'APP_'],
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules/zustand')) {
            return 'vendor-store';
          }
          if (id.includes('node_modules/qrcode')) {
            return 'vendor-qr';
          }
          if (id.includes('node_modules/@supabase') || id.includes('node_modules/ws') || id.includes('node_modules/isows')) {
            return 'vendor-supabase';
          }
        },
      },
    },
  },
}))
