import logo from '@assets/img/logo.svg'

export default function NewTab() {
  return (
    <div className="text-center">
      <header className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
        <img
          src={logo}
          className="motion-safe:animate-spin-slow pointer-events-none h-40"
          alt="logo"
        />
        <p>
          Edit <code>src/pages/newtab/Newtab.tsx</code> and save to reload.
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
