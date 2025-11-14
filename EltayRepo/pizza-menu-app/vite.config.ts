import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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
  plugins: [react(), healthEndpointPlugin()],
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

