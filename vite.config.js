import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const PROXYTARGET = 'https://nodejs213.dszcbaross.edu.hu'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({

      babel: {
        plugins: [['babel-plugin-react-compiler']],
        
      },
    }),
  ],
  server: {
    proxy: {
      '/users': {
        target: PROXYTARGET,
        changeOrigin: true
      },
      '/admin': {
        target: PROXYTARGET,
        changeOrigin: true
      },
      '/orders': {
        target: PROXYTARGET,
        changeOrigin: true
      },
      '/product': {
        target: PROXYTARGET,
        changeOrigin: true
      }
    }
  }
})
