import { createRoot } from 'react-dom/client'
import css from './index.css?inline'
import App from './App'

const div = document.createElement('section')
div.id = 'trading-helper-root'
document.body.appendChild(div)

const rootContainer = document.querySelector(`#${div.id}`)
if (!rootContainer) throw new Error('Error attaching root container')

if (rootContainer.shadowRoot === null)
  rootContainer.attachShadow({ mode: 'open' })
const shadowRoot = rootContainer.shadowRoot
if (!shadowRoot) throw new Error('Error attaching shadow root')

const shadowRootId = 'trading-helper-shadow-root'
let shadowRootContainer = shadowRoot.getElementById(shadowRootId)
shadowRootContainer = document.createElement('div')
shadowRootContainer.id = shadowRootId
shadowRoot.appendChild(shadowRootContainer)

const style = document.createElement('style')
style.textContent = css
shadowRoot.appendChild(style)

const root = createRoot(shadowRootContainer)
root.render(<App />)

try {
  console.log('Content script loaded')
} catch (e) {
  console.error(e)
}
