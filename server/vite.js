import { createServer as createViteServer } from 'vite'
import express from 'express'

async function createServer() {
  const app = express()

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: 'client'
  })

  app.use(vite.ssrFixStacktrace)
  app.use('/', vite.middlewares)

  return { app, vite }
}

export { createServer }