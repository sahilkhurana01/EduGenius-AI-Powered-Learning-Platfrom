import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),  
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa1.png', 'kid.jpg', 'edugenius logo.png'],
      manifest: {
        name: 'EduGenius - AI Powered Learning Platform',
        short_name: 'EduGenius',
        description: 'Educational Platform powered by AI',
        theme_color: '#4338CA',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/EduGenius-AI-Powered-Learning-Platfrom/',
        start_url: '/EduGenius-AI-Powered-Learning-Platfrom/',
        icons: [
          {
            src: '/EduGenius-AI-Powered-Learning-Platfrom/pwa1.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/EduGenius-AI-Powered-Learning-Platfrom/pwa1.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/EduGenius-AI-Powered-Learning-Platfrom/pwa1.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/EduGenius-AI-Powered-Learning-Platfrom/pwa1.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/EduGenius-AI-Powered-Learning-Platfrom/pwa1.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/EduGenius-AI-Powered-Learning-Platfrom/pwa1.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/EduGenius-AI-Powered-Learning-Platfrom/pwa1.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/EduGenius-AI-Powered-Learning-Platfrom/pwa1.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  base: "/EduGenius-AI-Powered-Learning-Platfrom/",
  server: {
    hmr: {
      host: 'localhost',
      protocol: 'ws'
    },
    // Handle SPA routing in development
    historyApiFallback: {
      disableDotRule: true,
      index: '/EduGenius-AI-Powered-Learning-Platfrom/'
    }
  },
  resolve: {
    alias: {
      // Add the same path aliases used in teaDash
      "@": path.resolve(__dirname, "./src"),
      // Add an alias for the teaDash components
      "teaDash": path.resolve(__dirname, "./teaDash"),
    },
  },
})
