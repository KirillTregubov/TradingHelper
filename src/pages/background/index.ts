console.log('background script loaded')

// const url = 'https://app.fundednext.com/*/trading-platform'
// const contentScript = 'src/pages/content/index.js'

// chrome.tabs.query({ url }, function (tabs) {
//   for (const tab of tabs) {
//     if (!tab.id) continue
//     chrome.tabs.reload(tab.id)
//   }
// })

async function clearBadgeText(tabId = undefined) {
  await chrome.action.setBadgeText({
    tabId,
    text: ''
  })
}

async function enableAction(tabId: number) {
  chrome.action.setIcon({
    tabId,
    path: {
      128: chrome.runtime.getURL('enabled-128.png')
    }
  })
  chrome.action.setPopup({
    tabId,
    popup: 'src/pages/popup-enabled/index.html'
  })
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'New'
  })
})

chrome.runtime.onMessage.addListener(async (message, sender) => {
  console.log('received message', message)

  if (message === 'popup_loaded') {
    clearBadgeText()
    return
  }

  const tabId = sender?.tab?.id
  if (!tabId) return

  if (message.name === 'script_loaded') {
    // setState(tabId)
    await enableAction(tabId)
    // await updateBadgeText(tabId)
    return
  }
})
