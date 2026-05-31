import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Define a base como vazia/relativa para que o HTML encontre o CSS/JS na pasta local informada pelo backend
  base: './', 
})