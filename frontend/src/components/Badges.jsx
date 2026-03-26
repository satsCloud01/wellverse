export function VerBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full text-[11px] font-semibold bg-moss/25 border border-sage/40 text-sage">
      ✓ Verified
    </span>
  )
}

export function EarlyBadge({ color = '#C8923A' }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase"
      style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}
    >
      ⏳ Early Access
    </span>
  )
}

export function StatusPill({ vertical }) {
  if (vertical.status === 'live') {
    return (
      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-pine/20 border border-pine/40 text-pine">
        ✓ Live Now
      </span>
    )
  }
  return (
    <span
      className="px-3 py-1 rounded-full text-[11px] font-bold"
      style={{ background: `${vertical.color}15`, border: `1px solid ${vertical.color}35`, color: vertical.accent }}
    >
      {vertical.eta}
    </span>
  )
}
