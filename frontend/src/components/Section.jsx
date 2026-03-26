export default function Section({ children, bg = '#0A0A08', className = '', ambient = '' }) {
  // ambient options: 'orbs' | 'orbs-teal' | 'orbs-gold' | 'orbs-wine' | 'pulse' | 'aurora' | 'grain'
  const ambientClasses = ambient
    .split(' ')
    .filter(Boolean)
    .map((a) => {
      if (a === 'orbs') return 'ambient-orbs'
      if (a === 'orbs-teal') return 'ambient-orbs ambient-orbs-teal'
      if (a === 'orbs-gold') return 'ambient-orbs ambient-orbs-gold'
      if (a === 'orbs-wine') return 'ambient-orbs ambient-orbs-wine'
      if (a === 'pulse') return 'ambient-pulse'
      if (a === 'aurora') return 'ambient-aurora'
      if (a === 'grain') return 'ambient-grain'
      return ''
    })
    .join(' ')

  return (
    <section className={`py-20 px-[6%] ${ambientClasses} ${className}`} style={{ background: bg }}>
      <div className="max-w-[1240px] mx-auto relative" style={{ zIndex: 2 }}>{children}</div>
    </section>
  )
}
