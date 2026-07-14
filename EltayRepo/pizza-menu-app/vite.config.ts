import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import type { Plugin } from 'vite'

// Health endpoint plugin
function healthEndpointPlugin(): Plugin {
  return {
    name: 'health-endpoint',
    configureServer(server) {
      server.middlewares.use('/health', (req, res, next) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'TimTim Pizza Menu',
            version: '1.0.0',
            uptime: process.uptime()
          }, null, 2))
        } else {
          next()
        }
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use('/health', (req, res, next) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'TimTim Pizza Menu',
            version: '1.0.0',
            uptime: process.uptime()
          }, null, 2))
        } else {
          next()
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    // Eski cihaz desteği (ör. iPad 2 / iOS 9 Safari): ES5 + polyfill'li legacy bundle üretir.
    legacy({
      targets: ['ios >= 9', 'safari >= 9', 'defaults'],
      additionalLegacyPolyfills: ['whatwg-fetch'],
      renderLegacyChunks: true,
      modernPolyfills: false,
    }),
    healthEndpointPlugin(),
  ],
  build: {
    // Legacy chunk'lar terser ile minify edilir; ES5 çıktı zorunlu (iOS 9 arrow fn desteklemez).
    terserOptions: {
      ecma: 5,
      safari10: true,
      compress: { ecma: 5, arrows: false },
      format: { ecma: 5 },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    allowedHosts: [
      '.onrender.com',
      'timtimpizza.com',
      'www.timtimpizza.com',
      'localhost',
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 4173,
  },
})

