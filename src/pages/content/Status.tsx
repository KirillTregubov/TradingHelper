export default function Status({ isTrading }: { isTrading: boolean }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border border-stone-700 bg-stone-800 px-3 py-0.5 text-sm"
      title={isTrading ? 'Order Screen is Open' : 'Order Screen is Hidden'}
    >
      <div
        className={`h-2 w-2 rounded-full ${
          isTrading ? 'bg-green-600' : 'bg-red-600'
        }`}
      />
      <h2>Trading</h2>
    </div>
  )
}
