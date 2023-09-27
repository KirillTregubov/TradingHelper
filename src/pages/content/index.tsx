import { createRoot } from 'react-dom/client'
import css from './index.css?inline'
import App from './App'
import { State, sendMessage } from '@src/helpers'

const rootID = 'trading-helper-root'
if (!document.getElementById(rootID)) {
  const div = document.createElement('section')
  div.id = rootID
  document.body.appendChild(div)
}

const rootContainer = document.querySelector(`#${rootID}`)
if (!rootContainer) throw new Error('Error attaching root container')

const shadowRootId = 'trading-helper-shadow-root'
let shadowRoot = rootContainer.shadowRoot
if (shadowRoot === null) {
  rootContainer.attachShadow({ mode: 'open' })
  shadowRoot = rootContainer.shadowRoot
}

if (!shadowRoot) throw new Error('Error attaching shadow root')
shadowRoot.getElementById(shadowRootId)?.remove()

let shadowRootContainer = shadowRoot.getElementById(shadowRootId)
shadowRootContainer = document.createElement('div')
shadowRootContainer.id = shadowRootId
shadowRoot.appendChild(shadowRootContainer)

const styleId = 'trading-helper-style'
shadowRoot.getElementById(styleId)?.remove()
const style = document.createElement('style')
style.id = styleId
style.textContent = css
shadowRoot.appendChild(style)

const root = createRoot(shadowRootContainer)
root.render(<App />)

const state: State = {
  enabled: false
}

console.log('Content script loaded')
sendMessage('script_loaded', { state })

// const App = document.getElementById('App')
// if (!App) throw new Error('Error attaching App')
// dragElement(App)

// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//   if (message === 'action_clicked') {
//     if (!state.enabled) {
//       state.enabled = true
//       console.log(state)
//       sendMessage('enabled', { state })
//       console.log('ENABLED')
//       return
//     }

//     console.log('i can do things')
//   }
// })
