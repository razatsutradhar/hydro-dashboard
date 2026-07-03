import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/hydro-dashboard/',  // set to your GitHub Pages repo name
})
