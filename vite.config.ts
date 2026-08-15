import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // The site deploys to https://<user>.github.io/PokAiMon/ (a project page,
  // not a <user>.github.io root site), so every asset URL needs this
  // repo-name prefix in production or they'd 404 once deployed. Local dev
  // stays at "/" so `npm run dev` keeps working the way you're used to.
  base: command === 'build' ? '/PokAiMon/' : '/',
}))
