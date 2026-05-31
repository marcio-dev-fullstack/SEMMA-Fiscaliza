import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration unificada para acoplamento estático no FastAPI
export default defineConfig({
  plugins: [react()],
  base: './' // Força caminhos relativos para os assets injetados pelo Python
})