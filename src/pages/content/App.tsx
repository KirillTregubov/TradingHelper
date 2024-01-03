import { useEffect, useState } from 'react'
import Draggable from 'react-draggable'
import Status from './Status'
import Price from './Price'
import { getTerminal, showError } from './helpers'
import Button from './Button'

export default function App() {
  const [isTrading, setIsTrading] = useState(false)
  const [observer, setObserver] = useState<MutationObserver | null>(null)
  const [isLong, setIsLong] = useState(true)
  const [showMenu, setShowMenu] = useState(true)

  useEffect(() => {
    return () => {
      if (observer) observer.disconnect()
    }
  }, [])

  function toggleOrder() {
    const terminal = getTerminal()
    if (!terminal) return
    const orderButton = terminal.querySelector(
      `div[title$="Trade Form (F9)"]`
    ) as HTMLDivElement
    if (!orderButton) return
    orderButton.click()
    setIsTrading(orderButton.title.split(' ')[0] === 'Hide')
  }

  function startTrading() {
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
            if (newTitle?.split(' ')[0] === 'Hide') {
              setTimeout(() => {
                setIsTrading(true)
              }, 200)
            } else {
              setIsTrading(false)
            }
          }
        })
      })
      setObserver(localObserver)
      localObserver.observe(orderButton, { attributes: true })
    }

    if (orderButton.title.split(' ')[0] === 'Hide') {
      setIsTrading(true)
      return
    }
    toggleOrder()
  }

  function getPrice() {
    const terminal = getTerminal()
    if (!terminal) return
    const elements = terminal.querySelectorAll('div.price-column')
    if (elements.length !== 2) {
      showError('opening menu')
      return
    }

    setShowMenu(!showMenu)
    // const sellPrice = elements[0].textContent
    // const buyPrice = elements[1].textContent
    // console.log(sellPrice, buyPrice)
  }

  return (
    <Draggable handle="#DragHandle" bounds="body">
      <div className="bottom absolute bottom-3 left-3 z-[1000] select-none rounded-lg border border-stone-700 bg-stone-900 pb-4 text-base text-white subpixel-antialiased shadow-md">
        <div
          id="DragHandle"
          className="peer flex cursor-grab justify-center py-2.5 active:cursor-grabbing"
        >
          <div className="h-1.5 w-8 rounded-full bg-stone-600" />
        </div>
        <div className="px-4 peer-active:select-none">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h1 className="text-lg">
              Welcome Back,{' '}
              <span className="font-medium">
                {import.meta.env.VITE_NAME || 'user'}
              </span>
            </h1>
            <Status isTrading={isTrading} />
          </div>
          {isTrading ? (
            <div>
              <div className="mb-3 flex items-center justify-between gap-3 only:mb-0">
                {showMenu ? (
                  <label className="group relative inline-flex cursor-pointer select-none items-center gap-2.5">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={isLong}
                      onChange={(e) => setIsLong(e.target.checked)}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-red-700 ring-white ring-offset-1 ring-offset-stone-900 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-red-400 after:bg-red-100 after:transition-all after:content-[''] group-hover:ring-2 peer-checked:bg-green-700 peer-checked:after:translate-x-full peer-checked:after:border-green-400 peer-checked:after:bg-green-100 peer-focus:outline-none peer-focus:ring-2" />
                    <span className="font-medium">
                      {isLong ? 'Long' : 'Short'} Mode
                    </span>
                  </label>
                ) : (
                  <div className="w-11" />
                )}
                <Button onClick={getPrice}>
                  {showMenu ? 'Close' : 'Open'} Menu
                </Button>
              </div>
              {showMenu && (
                <Price
                  isLong={isLong}
                  changeLong={(isLong: boolean) => {
                    setIsLong(isLong)
                  }}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <Button onClick={startTrading}>Start Trading</Button>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  )
}
