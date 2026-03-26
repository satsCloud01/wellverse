import { useState } from 'react'
import Tag from './Tag'
import { VerBadge, EarlyBadge } from './Badges'
import Divider from './Divider'

export default function GuideCard({ guide, onOpen, preview = false }) {
  const [hov, setHov] = useState(false)
  const g = guide

  return (
    <div
      onClick={() => !preview && onOpen?.(g)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="overflow-hidden transition-all duration-300 card-glow"
      style={{
        background: 'rgba(255,255,255,.03)',
        border: `1px solid ${hov && !preview ? g.color + '55' : 'rgba(255,255,255,.08)'}`,
        borderRadius: 18,
        cursor: preview ? 'default' : 'pointer',
        transform: hov && !preview ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hov && !preview ? '0 20px 48px rgba(0,0,0,.5)' : 'none',
        opacity: preview ? 0.85 : 1,
      }}
    >
      <div className="px-5 pt-5 pb-3.5" style={{ background: `${g.color}18`, borderBottom: `1px solid ${g.color}20` }}>
        <div className="flex justify-between items-start mb-3">
          <div
            className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[22px]"
            style={{ background: `${g.color}28` }}
          >
            {g.emoji}
          </div>
          {preview ? (
            <EarlyBadge color={g.color} />
          ) : (
            <div className="flex flex-col items-end gap-1">
              <Tag color={g.color}>Founding Guide</Tag>
              <VerBadge />
            </div>
          )}
        </div>
        <h3 className="font-display text-[19px] font-semibold text-parchment mb-0.5">{g.name}</h3>
        <p className="text-xs text-mist">{g.role}</p>
      </div>
      <div className="px-5 pt-4 pb-5">
        <p className="font-display text-[13px] italic text-dust leading-relaxed mb-3">
          "{g.quote?.slice(0, 80)}..."
        </p>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {g.methods?.slice(0, 2).map((m) => (
            <span
              key={m}
              className="px-2.5 py-[3px] rounded-2xl text-[11px] text-mist"
              style={{ background: `${g.color}12`, border: `1px solid ${g.color}25` }}
            >
              {m}
            </span>
          ))}
        </div>
        <Divider />
        <div className="pt-3 flex justify-between items-center">
          <div>
            <p className="text-[13px] font-semibold text-gold">★ {g.rating} ({g.review_count})</p>
            {!preview && <p className="text-[11px] text-pine mt-0.5 font-medium">✓ Free 30-min intro call</p>}
          </div>
          <p className="font-display text-base font-semibold text-parchment">{g.price}</p>
        </div>
      </div>
    </div>
  )
}
