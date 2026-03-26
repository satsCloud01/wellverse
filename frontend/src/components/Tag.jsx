export default function Tag({ children, color = '#C8923A' }) {
  return (
    <span
      className="inline-block px-3 py-[3px] rounded-full text-[11px] font-bold tracking-widest uppercase"
      style={{
        background: `${color}22`,
        border: `1px solid ${color}40`,
        color,
      }}
    >
      {children}
    </span>
  )
}
