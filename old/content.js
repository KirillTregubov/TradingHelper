// const port = chrome.runtime.connect({ name: 'content' })
const state = {
  enabled: false
}

function sendMessage(name, params) {
  try {
    chrome.runtime.sendMessage({ name, ...params })
  } catch (e) {
    console.log('Error sending message', e)
  }
}

console.log('Script loaded', state)
sendMessage('script_loaded', { state })

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
