import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@global': resolve('src/global'),
        '@resources': resolve('/resources'),
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@global': resolve('src/global'),
        '@resources': resolve('/resources'),
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@global': resolve('src/global'),
        '@': resolve('src/renderer/src'),

        '@resources': resolve('/resources')
      }
    },
    plugins: [react()]
  }
})
