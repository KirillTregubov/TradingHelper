console.log('Loaded background.js')

const url = 'https://*.example.com/*'

chrome.tabs.query({ url }, function (tabs) {
  for (const tab of tabs) {
    console.log(tab)
    try {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      })
    } catch (e) {
      console.error('failed injecting tab', tab, e)
    }
  }
})

// const state = {}

// const defaultState = {
//   enabled: false
// }

// function setState(tabId, newState = null) {
//   if (!state[tabId]) {
//     state[tabId] = defaultState
//   }
//   if (!newState) return
//   state[tabId] = newState
// }

// async function updateBadgeText(tabId) {
//   await chrome.action.setBadgeText({
//     tabId,
//     text: state[tabId].enabled ? 'ON' : 'OFF'
//   })
// }

async function clearBadgeText(tabId = undefined) {
  await chrome.action.setBadgeText({
    tabId,
    text: ''
  })
}

async function enableAction(tabId) {
  chrome.action.setIcon({
    tabId,
    path: {
      128: chrome.runtime.getURL('images/enabled-128.png')
    }
  })
  chrome.action.setPopup({
    tabId,
    popup: 'popup.html'
  })
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'New'
  })
})

// async function handleTab(tab) {
//   const tabId = tab.id
//   if (tab.url && tab.url.startsWith('https://www.google.com/')) {
//     console.log('Initialized', tabId)
//     setState(tabId)
//     await updateBadgeText(tabId)
//     chrome.action.enable()
//   } else {
//     clearBadgeText(tabId)
//     chrome.action.disable()
//   }
// }

// chrome.tabs.onUpdated.addListener(async (tab) => {
//   console.log('updated')
//   handleTab(tab)
// })

// chrome.tabs.onActivated.addListener(async (activeInfo) => {
//   console.log('activated', activeInfo.tabId)
//   const tab = await chrome.tabs.get(activeInfo.tabId)
//   handleTab(tab)
// })

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('received message', message)

  if (message === 'popup_loaded') {
    console.log('popup loaded')
    clearBadgeText()
    return
  }

  if (!sender.hasOwnProperty('tab')) return
  const tabId = sender.tab.id

  if (message.name === 'script_loaded') {
    // setState(tabId)
    await enableAction(tabId)
    // await updateBadgeText(tabId)
    return
  }

  //   if (message.name === 'script_loaded' && sender.tab.active) {
  //     setState(tabId)
  //     await updateBadgeText(tabId)
  //     return
  //   }
  //   if (message.name === 'enabled') {
  //     setState(tabId, message.state)
  //     await updateBadgeText(tabId)
  //     return
  //   }
})

// chrome.action.onClicked.addListener(async (tab) => {
//   chrome.tabs.sendMessage(tab.id, 'action_clicked')
// })

//   chrome.action.disable()
//   chrome.action.setBadgeBackgroundColor({
//     color: '#4688F1'
//   })

// const extensions = 'https://developer.chrome.com/docs/extensions'
// const webstore = 'https://developer.chrome.com/docs/webstore'

//     // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
//   const prevState = await chrome.action.getBadgeText({ tabId: tab.id })
//   // Next state will always be the opposite
//   const nextState = prevState === 'ON' ? 'OFF' : 'ON'

//   // Set the action badge to the next state
//   await chrome.action.setBadgeText({
//     tabId: tab.id,
//     text: nextState
//   })

//   if (nextState === 'ON') {
//     // Insert the CSS file when the user turns the extension on
//     console.log('IM ON')
//     // await chrome.scripting.insertCSS({
//     //   files: ["focus-mode.css"],
//     //   target: { tabId: tab.id },
//     // });
//   } else if (nextState === 'OFF') {
//     // Remove the CSS file when the user turns the extension off
//     console.log('IM OFF')
//     // await chrome.scripting.removeCSS({
//     //   files: ["focus-mode.css"],
//     //   target: { tabId: tab.id },
//     // });
//   }
