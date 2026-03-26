import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { C } from '../tokens'
import Section from '../components/Section'
import Btn from '../components/Btn'
import GuideCard from '../components/GuideCard'
import WaitlistBox from '../components/WaitlistBox'
import { StatusPill } from '../components/Badges'
import { FloatingParticles } from '../components/AmbientBg'

export default function VerticalDetail({ onOpenGuide }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vertical, setVertical] = useState(null)
  const [guides, setGuides] = useState([])

  useEffect(() => {
    api.getVertical(id).then(setVertical).catch(() => {})
    api.getGuides({ vertical_id: id }).then(setGuides).catch(() => {})
  }, [id])

  if (!vertical) return <div className="min-h-screen flex items-center justify-center text-mist">Loading...</div>

  const v = vertical
  const isLive = v.status === 'live'

  return (
    <div>
      {/* Hero */}
      <section
        className="px-[6%] pt-24 pb-16 relative overflow-hidden ambient-grain"
        style={{ background: `radial-gradient(ellipse 50% 50% at 65% 50%, ${v.color}22 0%, transparent 55%), ${C.ember}` }}
      >
        <FloatingParticles count={15} color={`${v.color}40`} />
        <div className="max-w-[1240px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span onClick={() => navigate('/explore')} className="text-sm text-mist cursor-pointer hover:text-gold transition-colors">← All Verticals</span>
            <span className="text-mist/30">·</span>
            <StatusPill vertical={v} />
          </div>
          <div className="flex items-center gap-5 mb-5">
            <div className="w-[70px] h-[70px] rounded-2xl flex items-center justify-center text-[36px]" style={{ background: `${v.color}22` }}>
              {v.emoji}
            </div>
            <div>
              <h1 className="font-display font-light" style={{ fontSize: 'clamp(34px,5vw,60px)' }}>{v.label}</h1>
              <p className="text-sm text-mist">{v.tagline}</p>
            </div>
          </div>
          <p className="text-base text-dust leading-[1.85] max-w-[640px] mb-6">{v.manifesto}</p>
          <div className="p-3.5 rounded-lg inline-block mb-6" style={{ background: `${v.color}15`, border: `1px solid ${v.color}30` }}>
            <p className="text-xs font-medium" style={{ color: v.accent }}>📊 {v.stat}</p>
          </div>
          {isLive && (
            <div className="flex gap-3">
              <Btn v="gold" onClick={() => navigate('/browse')}>Browse {v.label} Guides →</Btn>
              <Btn v="ghost" onClick={() => navigate('/apply')}>List Your Practice →</Btn>
            </div>
          )}
        </div>
      </section>

      {/* Why + Guide Types */}
      <Section bg={C.void} ambient="orbs aurora">
        <div className="grid gap-10" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <p className="text-[11px] font-bold tracking-[2px] uppercase mb-3" style={{ color: v.accent }}>Why This Vertical</p>
            <p className="text-[15px] text-dust leading-[1.85] mb-5">{v.why}</p>
            <div className="p-3.5 rounded-lg mb-6" style={{ background: `${v.color}15`, border: `1px solid ${v.color}30` }}>
              <p className="text-xs font-medium" style={{ color: v.accent }}>📊 {v.stat}</p>
            </div>
            {isLive ? (
              <Btn v="gold" onClick={() => navigate('/browse')}>Find a {v.label} Guide →</Btn>
            ) : (
              <WaitlistBox vertical={v} />
            )}
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-3.5">Guide Types in This Vertical</p>
            {v.guide_types?.map((g, i) => (
              <div key={i} className="flex items-center gap-2.5 py-3 border-b border-white/5">
                <div className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: v.accent }} />
                <span className="text-sm text-dust">{g}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-pillars */}
        {v.sub_pillars && v.sub_pillars.length > 0 && (
          <div className="mt-14">
            <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-5">Sub-Pillars</p>
            <div className="grid grid-cols-2 gap-5">
              {v.sub_pillars.map((sp) => (
                <div key={sp.id} className="rounded-2xl p-6" style={{ background: `${sp.color}10`, border: `1px solid ${sp.color}30` }}>
                  <div className="text-[28px] mb-3">{sp.icon}</div>
                  <h3 className="font-display text-xl font-semibold text-parchment mb-2">{sp.label}</h3>
                  <p className="text-[13px] text-dust leading-[1.8]">{sp.why}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Guides */}
      {guides.length > 0 && (
        <Section bg={C.ink} ambient="grain pulse">
          <p className="text-[11px] font-bold tracking-[3px] uppercase mb-3" style={{ color: v.accent }}>
            {isLive ? 'Bookable Guides' : 'Preview Guides'}
          </p>
          <h2 className="font-display font-normal mb-6" style={{ fontSize: 'clamp(24px,3vw,40px)' }}>
            {isLive ? `Meet your ${v.label} guides` : `Guides joining when ${v.label} launches`}
          </h2>
          {!isLive && (
            <div className="flex items-center gap-2.5 p-3 rounded-[10px] mb-6" style={{ background: `${v.color}10`, border: `1px solid ${v.color}25` }}>
              <span className="text-base">⏳</span>
              <p className="text-[13px]" style={{ color: v.accent }}>These guides will be available when this vertical launches.</p>
            </div>
          )}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(guides.length, 4)}, 1fr)` }}>
            {guides.map((g) => (
              <GuideCard key={g.id} guide={g} onOpen={onOpenGuide} preview={g.is_preview} />
            ))}
          </div>
        </Section>
      )}

      {/* Waitlist for early access verticals with no guides */}
      {!isLive && guides.length === 0 && (
        <Section bg={C.ink} ambient="grain pulse">
          <div className="max-w-[500px] mx-auto">
            <WaitlistBox vertical={v} />
          </div>
        </Section>
      )}
    </div>
  )
}
