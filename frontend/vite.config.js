import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    
    // Définir les variables d'environnement pour le build
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || 'http://localhost:3000'
      ),
    },
    
    server: {
      host: '0.0.0.0',
      port: 5173,
      // Proxy pour le développement local
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
    }
  }
})
