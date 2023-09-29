import { useEffect, useState } from 'react'
import { getTerminal, showError } from './helpers'
import Reload from './Reload'
import Button from './Button'

export default function Price({
  isLong,
  changeLong
}: {
  isLong: boolean
  changeLong: (isLong: boolean) => void
}) {
  const [currentPrice, setCurrentPrice] = useState<null | number>(null)
  const [observer, setObserver] = useState<MutationObserver | null>(null)
  const [watchingStop, setWatchingStop] = useState(false)
  const [stopPrice, setStopPrice] = useState<null | number>(null)
  const [riskRatio, setRiskRatio] = useState(2)
  const [riskAmount, setRiskAmount] = useState(1000)
  const [refreshing, setRefreshing] = useState(false)
  const [animating, setAnimating] = useState(false)

  function stopEventHandler(event: Event) {
    const value = (event.target as HTMLInputElement).value
    if (value === '') {
      setStopPrice(null)
      return
    }
    setStopPrice(parseFloat(value))
  }

  function updateStop() {
    setAnimating(true)
    const terminal = getTerminal()
    if (!terminal) return
    const inputs = terminal.querySelectorAll(
      'label.input.number-input input[type="text"][inputmode="decimal"]'
    )
    if (inputs.length !== 3) return
    const stop = inputs[1] as HTMLInputElement
    if (stop.value === '') return

    const newValue = parseFloat(stop.value)
    setStopPrice(newValue)

    if (!currentPrice) return
    if (isLong) {
      if (currentPrice <= newValue) {
        changeLong(false)
        return
      }
    } else {
      if (currentPrice >= newValue) {
        changeLong(true)
        return
      }
    }
  }

  function populateData() {
    const terminal = getTerminal()
    if (!terminal) return

    const elements = terminal.querySelectorAll('div.price-column')
    if (elements.length !== 2) {
      showError('finding price')
      return
    }

    try {
      if (isLong) {
        const price = elements[1].textContent?.replace(/\s/g, '')
        if (price) setCurrentPrice(parseFloat(price))
      } else {
        const price = elements[0].textContent?.replace(/\s/g, '')
        if (price) setCurrentPrice(parseFloat(price))
      }
    } catch (e) {
      alert('Error getting price number, please contact the developer.')
      return
    }

    const inputs = terminal.querySelectorAll(
      'label.input.number-input input[type="text"][inputmode="decimal"]'
    )
    if (inputs.length !== 3) {
      showError('finding stop loss input')
      return
    }

    const stop = inputs[1] as HTMLInputElement
    if (stop.value !== '') {
      setStopPrice(parseFloat(stop.value))
    }
    if (!watchingStop) {
      stop.addEventListener('input', stopEventHandler)
      setWatchingStop(true)
    }
  }

  function setTrade() {
    if (!currentPrice || !stopPrice) return

    const terminal = getTerminal()
    if (!terminal) return

    const inputs = terminal.querySelectorAll(
      'label.input.number-input input[type="text"][inputmode="decimal"]'
    )
    if (inputs.length !== 3) {
      showError('finding stop loss input')
      return
    }
    const diff = currentPrice - stopPrice
    const profit = (riskRatio * diff + currentPrice).toFixed(2)
    const lotSize = (riskAmount / (diff * 10)).toFixed(2)
    // console.log(profit, lotSize)

    const profitInput = inputs[2] as HTMLInputElement
    const lotSizeInput = inputs[0] as HTMLInputElement

    profitInput.value = ''
    profitInput.dispatchEvent(new Event('input', { bubbles: true }))

    lotSizeInput.value = ''
    lotSizeInput.dispatchEvent(new Event('input', { bubbles: true }))

    profitInput.value = profit
    profitInput.dispatchEvent(new Event('input', { bubbles: true }))

    lotSizeInput.value = lotSize
    lotSizeInput.dispatchEvent(new Event('input', { bubbles: true }))
  }

  function refresh() {
    const terminal = getTerminal()
    if (!terminal) return
    const inputs = terminal.querySelectorAll(
      'label.input.number-input input[type="text"][inputmode="decimal"]'
    )
    if (inputs.length !== 3) return
    const stopInput = inputs[1] as HTMLInputElement
    const stopValue = parseFloat(stopInput.value)
    if (!stopValue) return

    const profitInput = inputs[2] as HTMLInputElement
    const profitValue = parseFloat(profitInput.value)

    //   console.log('old was long', !isLong)
    //   console.log('new is long', isLong)
    // console.log('stop', stopValue)

    const elements = terminal.querySelectorAll('div.price-column')
    if (elements.length !== 2) return

    const buyPrice = elements[1].textContent?.replace(/\s/g, '')
    const sellPrice = elements[0].textContent?.replace(/\s/g, '')
    if (!buyPrice || !sellPrice) return
    const buyValue = parseFloat(buyPrice)
    const sellValue = parseFloat(sellPrice)
    // console.log('buy', buyValue)
    // console.log('sell', sellValue)

    if (isLong) {
      if (buyValue >= stopValue) {
        changeLong(true)
        return
      }
    } else {
      if (sellValue <= stopValue) {
        changeLong(false)
        return
      }
    }

    let diff = 0
    if (isLong) {
      diff = parseFloat((stopValue - sellValue).toFixed(2))
    } else {
      diff = parseFloat((buyValue - stopValue).toFixed(2))
    }
    //   console.log('diff', diff)

    stopInput.value = ''
    stopInput.dispatchEvent(new Event('input', { bubbles: true }))

    let newStopValue = 0
    if (isLong) {
      newStopValue = parseFloat((buyValue - diff).toFixed(2))
    } else {
      newStopValue = parseFloat((sellValue + diff).toFixed(2))
    }
    // console.log('new stop', newStopValue)
    stopInput.value = newStopValue.toString()
    stopInput.dispatchEvent(new Event('input', { bubbles: true }))

    setStopPrice(newStopValue)

    if (!profitValue) return

    profitInput.value = ''
    profitInput.dispatchEvent(new Event('input', { bubbles: true }))

    let newProfitValue = 0
    if (isLong) {
      newProfitValue = parseFloat((buyValue + diff * riskRatio).toFixed(2))
    } else {
      newProfitValue = parseFloat((sellValue - diff * riskRatio).toFixed(2))
    }
    // console.log('new profit', newProfitValue)
    profitInput.value = newProfitValue.toString()
    profitInput.dispatchEvent(new Event('input', { bubbles: true }))
  }

  useEffect(() => {
    return () => {
      if (observer) observer.disconnect()
      if (watchingStop) {
        const terminal = getTerminal()
        if (!terminal) return
        const inputs = terminal.querySelectorAll(
          'label.input.number-input input[type="text"][inputmode="decimal"]'
        )
        if (inputs.length !== 3) return
        const stop = inputs[1] as HTMLInputElement
        stop.removeEventListener('input', stopEventHandler)
      }
    }
  }, [])

  useEffect(() => {
    if (observer) observer.disconnect()

    populateData()

    if (refreshing) refresh()
    setRefreshing(true)

    // setup observer
    const terminal = getTerminal()
    if (!terminal) return
    const elements = terminal.querySelectorAll('div.price-column')
    if (elements.length !== 2) return

    const priceElement = elements[isLong ? 1 : 0]
    const localObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'characterData') {
          const newPrice = mutation.target.textContent?.replace(/\s/g, '')
          if (newPrice) setCurrentPrice(parseFloat(newPrice))
        }
      })
    })
    setObserver(localObserver)
    localObserver.observe(priceElement, {
      characterData: true,
      childList: true,
      subtree: true
    })
  }, [isLong])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">
          Current ({isLong ? 'Buy' : 'Sell'}) Price
        </h2>
        <span className="select-text">
          {currentPrice?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </span>
      </div>
      {watchingStop && (
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-sm">
              <h2 className="font-medium">Stop Price</h2>
              <button
                onClick={updateStop}
                className={`rounded-full p-1 hover:bg-stone-700/60 active:bg-stone-800 ${
                  animating && 'animate-spin'
                }`}
                onAnimationEnd={() => setAnimating(false)}
              >
                <Reload />
              </button>
            </div>
            {stopPrice ? (
              <span className="select-text">
                {stopPrice?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            ) : (
              <span>not set</span>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Risk / Reward Ratio</h2>
        <input
          type="number"
          step="0.1"
          value={riskRatio}
          onChange={(e) => {
            const value = e.target.value
            if (value === '') {
              setRiskRatio(0)
              return
            }
            const newVal = parseFloat(value)
            e.target.value = newVal.toString()
            setRiskRatio(newVal)
          }}
          className="w-16 rounded-md border border-stone-700 bg-stone-800 px-1 py-0.5 ring-white ring-offset-1 ring-offset-stone-900 hover:ring-2 focus:outline-none focus:ring-2"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Risk Amount ($)</h2>
        <input
          type="number"
          step="1"
          value={riskAmount}
          onChange={(e) => {
            const value = e.target.value
            if (value === '') {
              setRiskAmount(0)
              return
            }
            const newVal = parseFloat(value)
            e.target.value = newVal.toString()
            setRiskAmount(newVal)
          }}
          className="w-24 rounded-md border border-stone-700 bg-stone-800 px-1 py-0.5 ring-white ring-offset-1 ring-offset-stone-900 hover:ring-2 focus:outline-none focus:ring-2"
        />
      </div>
      <Button
        fullWidth
        disabled={!currentPrice || !stopPrice}
        onClick={setTrade}
      >
        Update Trade
      </Button>
    </div>
  )
}
