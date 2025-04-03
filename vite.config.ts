import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/ourmoney/"  // Certifique-se de que "/ourmoney/" é o caminho correto para o seu servidor
})
