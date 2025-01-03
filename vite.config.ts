import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag: any) => ['lottie-player', 'center'].includes(tag)
        }
      }
    }),
    vueJsx(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Human Resource Information System',
        short_name: 'HRIS',
        description: 'Human Resource Information System for DuniaBuah',
        theme_color: '#FCF6EC',
        background_color: '#FFFFFF',
        start_url: '.',
        display: 'standalone',
        icons: [
          {
            src: 'assets/images/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          },
          {
            src: 'assets/images/logo192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: 'assets/images/logo512.png',
            type: 'image/png',
            sizes: '512x512'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 5000000
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
