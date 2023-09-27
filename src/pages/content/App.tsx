// import { useEffect } from 'react'
// import { runtime } from 'webextension-polyfill'

export default function App() {
  // useEffect(() => {
  //   runtime.sendMessage('popup_loaded')
  // }, [])

  return (
    <div className="fixed bottom-0 left-0 z-[1000] bg-amber-400 text-lg text-black">
      content script loaded 2
    </div>
  )
}
