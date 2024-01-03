export default function Button({
  onClick,
  disabled = false,
  fullWidth = false,
  children,
  title = undefined
}: {
  onClick: () => void
  disabled?: boolean
  fullWidth?: boolean
  children: React.ReactNode
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md border border-stone-700 bg-stone-700/60 px-3 py-1.5 text-sm text-white ring-white ring-offset-1 ring-offset-stone-900 transition-colors hover:bg-stone-800 focus:outline-none focus-visible:ring-2 active:bg-stone-900 disabled:cursor-not-allowed disabled:border-stone-800 disabled:bg-stone-800 ${
        fullWidth ? 'w-full' : 'w-[fit-content]'
      }`}
      title={title}
    >
      {children}
    </button>
  )
}
