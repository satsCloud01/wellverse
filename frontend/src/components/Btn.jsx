import { C } from '../tokens'

const variants = {
  gold: 'bg-amber text-white hover:brightness-110',
  ghost: 'bg-transparent border border-white/[.22] text-parchment hover:bg-white/5',
  teal: 'bg-teal text-white hover:brightness-110',
  outline: 'bg-transparent border border-white/[.15] text-dust hover:bg-white/5',
  moss: 'bg-moss text-white hover:brightness-110',
}

export default function Btn({ children, v = 'gold', onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`font-body font-semibold rounded-[10px] transition-all text-sm px-6 py-3 cursor-pointer tracking-wide ${variants[v] || variants.gold} ${className}`}
    >
      {children}
    </button>
  )
}
