import { useState } from 'react'
import Draggable from 'react-draggable'

function setInputValue(input: HTMLInputElement, value: string) {
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

let terminal: null | Document = null

function getTerminal() {
  if (terminal) return terminal
  const iframe = document.querySelector(
    'iframe[src="https://trade.fundednext.com/terminal"]'
  ) as HTMLIFrameElement
  if (!iframe || !iframe.contentWindow) return null
  try {
    iframe.contentWindow.document
  } catch (e) {
    console.error('Permission denied. Please run Chrome in insecure mode.')
    return null
  }
  terminal = iframe.contentWindow.document
  return terminal
}

// function orderVisible() {
//   const terminal = getTerminal()
//   if (!terminal) return false
//   const order = terminal.querySelector(
//     'div[title$="Trade Form (F9)"]'
//   ) as HTMLDivElement
//   if (!order) return false
//   return order.title.split(' ')[0] === 'Show'
// }

let observing = false

// const observer = new MutationObserver(function (mutations) {
//   mutations.forEach(function (mutation) {
//     if (mutation.type === 'attributes' && mutation.attributeName === 'title') {
//       const newTitle = (mutation.target as Element).getAttribute('title')
//       console.log('Title changed:', newTitle)
//     }
//   })
// })

export default function App() {
  // const [started, setStarted] = useState(false)
  const [orderShown, setOrderShown] = useState(false)

  function autofill() {
    const terminal = getTerminal()
    if (!terminal) return
    const passwordInput = terminal.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement
    if (!passwordInput) return
    setInputValue(passwordInput, import.meta.env.VITE_PASSWORD)

    const loginInput = terminal.querySelector(
      'input[name="login"]'
    ) as HTMLInputElement
    if (!loginInput) return
    setInputValue(loginInput, import.meta.env.VITE_LOGIN)
  }

  function toggleOrder() {
    const terminal = getTerminal()
    if (!terminal) return
    const orderButton = terminal.querySelector(
      `div[title$="Trade Form (F9)"]`
    ) as HTMLDivElement
    if (!orderButton) return
    orderButton.click()

    if (observing) return
    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'title'
        ) {
          const newTitle = (mutation.target as Element).getAttribute('title')
          console.log('Title changed:', newTitle)
          setOrderShown(newTitle?.split(' ')[0] === 'Hide')
        }
      })
    }).observe(orderButton, { attributes: true })
    observing = true

    // console.log(orderVisible())
    // if (orderVisible()) {
    //   const terminal = getTerminal()
    //   if (!terminal) return
    //   const input = terminal.querySelector(
    //     'label.input.number-input input[type="text"]'
    //   )
    //   console.log('input', input)
    // }
  }

  function refresh() {
    const terminal = getTerminal()
    if (!terminal) return
    const orderButton = terminal.querySelector(
      `div[title$="Trade Form (F9)"]`
    ) as HTMLDivElement
    if (!orderButton) return
    setOrderShown(orderButton.title.split(' ')[0] === 'Hide')
  }

  // function toggleTrading() {
  //   if (!started) {
  //     const terminal = getTerminal()
  //     if (!terminal) return

  //   }
  //   // () => setStarted(!started)}
  // }

  return (
    <Draggable handle="#DragHandle" bounds="body">
      <div className="bottom absolute bottom-3 left-3 z-[1000] rounded-lg border border-stone-700 bg-stone-900 pb-4 text-lg text-white shadow-md">
        <div
          id="DragHandle"
          className="peer flex cursor-grab justify-center pb-4 pt-2.5 active:cursor-grabbing"
        >
          <div className="h-1.5 w-8 rounded-full bg-stone-600" />
        </div>
        <div className="px-5 peer-active:select-none">
          <div className="flex flex-col">
            <button onClick={autofill}>Autofill Login</button>
            {/* <button onClick={() => setStarted(!started)}>
              {started ? 'Stop' : 'Start'} Trading
            </button>
            {started && (
              <> */}
            <button onClick={toggleOrder}>Toggle Order Menu</button>
            {/* </>
            )} */}
            {orderShown ? (
              <>
                <h1>Trading</h1>
              </>
            ) : (
              <>
                <h1>Not Trading</h1>
                <button onClick={refresh}>Start Trading</button>
              </>
            )}
            {JSON.stringify(orderShown)}
          </div>
        </div>
      </div>
    </Draggable>
  )
}
