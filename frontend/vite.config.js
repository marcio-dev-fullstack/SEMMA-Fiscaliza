import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração robusta com esvaziamento de cache de build para homologação local
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    emptyOutDir: true,
    manifest: true
  }
})