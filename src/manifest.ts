import type { Manifest } from 'webextension-polyfill'
import packageJson from '../package.json'

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: packageJson.displayName,
  version: packageJson.version,
  description: packageJson.description,
  // options_ui: {
  //   page: 'src/pages/options/index.html'
  // },
  // background: {
  //   service_worker: 'src/pages/background/index.js',
  //   type: 'module'
  // },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-34.png'
  },
  chrome_url_overrides: {
    newtab: 'src/pages/newtab/index.html'
  },
  icons: {
    '128': 'icon-128.png'
  },
  permissions: ['activeTab'],
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['src/pages/content/index.js']
      // css: ['contentStyle.css']
    }
  ],
  // devtools_page: 'src/pages/devtools/index.html',
  web_accessible_resources: [
    {
      resources: ['contentStyle.css', 'icon-128.png', 'icon-34.png'],
      matches: []
    }
  ]
}

export default manifest
