import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import WindiCSS from 'vite-plugin-windicss'
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const envJs = require('./env')[process.env.mode || 'dev3']

  return defineConfig({
    plugins: [
      react(),
      WindiCSS(),
      createStyleImportPlugin({
        resolves: [AntdResolve()],
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: envJs.API_URL,
          changeOrigin: true, // 是否跨域
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    define: {
      API_URL: JSON.stringify(envJs.API_URL),
      MODE: JSON.stringify(envJs.MODE),
    },
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
    },
  })
}
