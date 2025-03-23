import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  base: "/EduGenius-AI-Powered-Learning-Platfrom",
  resolve: {
    alias: {
      // Add the same path aliases used in teaDash
      "@": path.resolve(__dirname, "./src"),
      // Add an alias for the teaDash components
      "teaDash": path.resolve(__dirname, "./teaDash"),
    },
  },
})
