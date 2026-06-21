import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/asir_maaeed/' : '/',
  envPrefix: ['VITE_', 'APP_'],
  plugins: [react(), tailwindcss()],
}))
