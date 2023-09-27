import colorLog from '../log'
import { PluginOption, build } from 'vite'
import { resolve } from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const packages = [
  {
    content: resolve(__dirname, '../../', 'src/pages/content/index.tsx')
  }
]

const outDir = resolve(__dirname, '../../', 'dist')

export default function buildContentScript(): PluginOption {
  return {
    name: 'build-content',
    async buildEnd() {
      for (const _package of packages) {
        await build({
          publicDir: false,
          plugins: [cssInjectedByJsPlugin()],
          build: {
            outDir,
            sourcemap: process.env.NODE_ENV === 'development',
            minify: process.env.NODE_ENV === 'production',
            reportCompressedSize: process.env.NODE_ENV === 'production',
            emptyOutDir: false,
            rollupOptions: {
              input: _package,
              output: {
                entryFileNames: (chunk) => {
                  return `src/pages/${chunk.name}/index.js`
                }
              }
            }
          },
          configFile: false
        })
      }
      colorLog('Content code build sucessfully', 'success')
    }
  }
}
