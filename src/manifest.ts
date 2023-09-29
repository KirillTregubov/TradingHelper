import type { Manifest } from 'webextension-polyfill'
import packageJson from '../package.json'

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: packageJson.displayName,
  version: packageJson.version,
  description: packageJson.description,
  icons: {
    '128': 'enabled-128.png'
  },
  // options_ui: {
  //   page: 'src/pages/options/index.html'
  // },
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module'
  },
  // action: {
  //   default_popup: 'src/pages/popup-disabled/index.html',
  //   default_icon: 'disabled-128.png',
  // },
  // chrome_url_overrides: {
  //   newtab: 'src/pages/newtab/index.html'
  // },
  content_scripts: [
    {
      matches: [
        'https://app.fundednext.com/*/trading-platform'
        // 'https://*.example.com/*'
      ],
      js: ['src/pages/content/index.js'],
      run_at: 'document_end',
      all_frames: false
      // css: ['contentStyle.css']
    }
  ],
  // devtools_page: 'src/pages/devtools/index.html',
  // web_accessible_resources: [
  //   {
  //     resources: ['contentStyle.css', 'icon-128.png', 'icon-34.png'],
  //     matches: []
  //   }
  // ],
  permissions: ['tabs'],
  host_permissions: ['https://*.fundednext.com/*']
}

export default manifest
