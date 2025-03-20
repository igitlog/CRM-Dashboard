// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';
export default defineNuxtConfig({
  dev: process.env.NODE_ENV !== 'production',
  vite: {
    server: {
      hmr: {
        protocol: 'ws', // Используй WebSocket для HMR
        host: '0.0.0.0',
        port: 3000, // Порт, на котором работает сервер
      },
      watch: {
        usePolling: true, // Включаем polling для наблюдения за файлами
      },
    },
  },
  builder: "vite",
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt' 
  ],

  compatibilityDate: '2025-03-17',
})