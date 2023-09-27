import logo from '@assets/img/logo.svg'

export default function Popup() {
  return (
    <div className="flex h-full min-h-screen bg-gray-800 p-3 text-center">
      <header className="flex flex-col items-center justify-center text-white">
        <img
          src={logo}
          className="pointer-events-none h-36 motion-safe:animate-spin-slow"
          alt="logo"
        />
        <p>
          Edit <code>src/pages/popup/Popup.jsx</code> and save to reload.
        </p>
        <a
          className="text-blue-400"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
      </header>
    </div>
  )
}
