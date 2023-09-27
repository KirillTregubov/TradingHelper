import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import makeManifest from './utils/plugins/make-manifest'
import buildContentScript from './utils/plugins/build-content-script'

const root = resolve(__dirname, 'src')
const pagesDir = resolve(root, 'pages')
const assetsDir = resolve(root, 'assets')
const outDir = resolve(__dirname, 'dist')
const publicDir = resolve(__dirname, 'public')

export default defineConfig({
  resolve: {
    alias: {
      '@src': root,
      '@assets': assetsDir,
      '@pages': pagesDir
    }
  },
  plugins: [react(), makeManifest(), buildContentScript()],
  publicDir,
  build: {
    outDir,
    sourcemap: process.env.NODE_ENV === 'development',
    minify: process.env.NODE_ENV === 'production',
    reportCompressedSize: process.env.NODE_ENV === 'production',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        // devtools: resolve(pagesDir, 'devtools', 'index.html'),
        // panel: resolve(pagesDir, 'panel', 'index.html'),
        background: resolve(pagesDir, 'background', 'index.ts'),
        'popup-disabled': resolve(pagesDir, 'popup-disabled', 'index.html'),
        'popup-enabled': resolve(pagesDir, 'popup-enabled', 'index.html')
        // newtab: resolve(pagesDir, 'newtab', 'index.html'),
        // options: resolve(pagesDir, 'options', 'index.html')
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`
      }
    }
  }
})
