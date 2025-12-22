import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Digital_Economy_Karmine_Web_App/', // Pour GitHub Pages - chemins relatifs
})
