import { useEffect, useState } from 'react'
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

export default function App() {
  const [orderShown, setOrderShown] = useState(false)
  const [observer, setObserver] = useState<MutationObserver | null>(null)

  useEffect(() => {
    return () => {
      if (observer) observer.disconnect()
    }
  }, [])

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
    setOrderShown(orderButton.title.split(' ')[0] === 'Hide')
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

    if (!observer) {
      const localObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'title'
          ) {
            const newTitle = (mutation.target as Element).getAttribute('title')
            setOrderShown(newTitle?.split(' ')[0] === 'Hide')
          }
        })
      })
      setObserver(localObserver)
      localObserver.observe(orderButton, { attributes: true })
    }

    if (orderButton.title.split(' ')[0] === 'Hide') {
      setOrderShown(true)
      return
    }
    toggleOrder()
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
          <h1>
            Welcome Back,{' '}
            <span className="font-medium">
              {import.meta.env.VITE_NAME || 'user'}
            </span>
          </h1>
          <div className="flex flex-col">
            <button onClick={autofill}>Autofill Login</button>
            {orderShown ? (
              <>
                <h1>Trading</h1>
              </>
            ) : (
              <>
                <button onClick={refresh}>Start Trading</button>
              </>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  )
}
