#!/usr/bin/env node
/* eslint-disable */
/*
  Starts a LocalTunnel on the given port and runs Next.js dev with
  NEXT_PUBLIC_SITE_URL pointing to the tunnel URL. Useful for Mercado Pago webhooks.
*/
const { spawn } = require('child_process')

async function start () {
  const port = process.env.PORT || 3000
  const subdomain = process.env.TUNNEL_SUBDOMAIN || ''

  // Usa exclusivamente LocalTunnel
  let url
  let tunnel
  let lt
  try {
    lt = require('localtunnel')
  } catch (e) {
    console.error('Dependency localtunnel not found. Install it with: npm i -D localtunnel')
    process.exit(1)
  }
  tunnel = await lt({ port: Number(port), subdomain: subdomain || undefined })
  url = tunnel.url.replace(/\/$/, '')
  console.log(`Tunnel ready: ${url}`)

  const env = { ...process.env, NEXT_PUBLIC_SITE_URL: url }
  // Detecta el gestor de paquetes actual para correr el dev server de forma compatible (bun/pnpm/yarn/npm)
  const ua = String(process.env.npm_config_user_agent || '').toLowerCase()
  let runCmd = 'npm run dev'
  if (ua.includes('bun')) runCmd = 'bun run dev'
  else if (ua.includes('pnpm')) runCmd = 'pnpm run dev'
  else if (ua.includes('yarn')) runCmd = 'yarn dev'

  // Usamos shell para evitar EINVAL en Windows al spawnear ejecutables
  const child = spawn(runCmd, {
    stdio: 'inherit',
    env,
    shell: true
  })

  child.on('close', (code) => {
    console.log(`Dev server exited with code ${code}`)
    tunnel.close()
    process.exit(code || 0)
  })

  process.on('SIGINT', () => {
    tunnel.close()
    process.exit(0)
  })
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})
