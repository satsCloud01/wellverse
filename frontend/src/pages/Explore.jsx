import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { C } from '../tokens'
import Section from '../components/Section'
import { StatusPill } from '../components/Badges'
import Divider from '../components/Divider'
import { FloatingParticles, FadeInOnScroll } from '../components/AmbientBg'

export default function Explore() {
  const navigate = useNavigate()
  const [verticals, setVerticals] = useState([])

  useEffect(() => {
    api.getVerticals().then(setVerticals).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section
        className="px-[6%] pt-24 pb-16"
        style={{ background: `radial-gradient(ellipse 55% 55% at 50% 50%, rgba(42,106,96,.12) 0%, transparent 60%), ${C.void}` }}
      >
        <FloatingParticles count={20} color="rgba(58,154,120,0.3)" />
        <div className="max-w-[1240px] mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3.5">The Full WellVerse</p>
          <h1 className="font-display font-light mb-5" style={{ fontSize: 'clamp(34px,5vw,66px)' }}>
            Six dimensions of <em className="text-gold">self-investment.</em>
          </h1>
          <p className="text-base text-dust max-w-[560px] mx-auto leading-[1.85]">
            Two are live and bookable today. Four are in early access — join their waitlists and be first when they open.
          </p>
        </div>
      </section>

      {/* All 6 verticals in 3-column grid */}
      <Section bg={C.ember} ambient="orbs aurora grain">
        <FadeInOnScroll>
        <div data-tour="explore-grid" className="grid grid-cols-3 gap-5 mb-20">
          {verticals.map((v) => (
            <div
              key={v.id}
              onClick={() => navigate(`/vertical/${v.id}`)}
              className="rounded-[20px] p-7 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col"
              style={{ background: v.status === 'live' ? `${v.color}10` : 'rgba(255,255,255,.02)', border: `1px solid ${v.color}${v.status === 'live' ? '30' : '25'}` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[28px]" style={{ background: `${v.color}22` }}>
                  {v.emoji}
                </div>
                <StatusPill vertical={v} />
              </div>
              <h3 className="font-display text-2xl font-semibold text-parchment mb-2">{v.label}</h3>
              <p className="text-sm text-mist mb-4">{v.tagline}</p>
              <Divider />
              <div className="mt-4 flex-1" />
              <span className="text-sm font-semibold" style={{ color: v.accent }}>
                {v.status === 'live' ? '✓ Live — book today →' : '⏳ Early access — join waitlist →'}
              </span>
            </div>
          ))}
        </div>
        </FadeInOnScroll>

        {/* Why All Six Matter */}
        <FadeInOnScroll>
        <div className="max-w-[800px]">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3.5">Why All Six Matter</p>
          <h2 className="font-display font-normal leading-tight mb-6" style={{ fontSize: 'clamp(26px,3.5vw,44px)' }}>
            You can't optimise one dimension while neglecting the rest.
          </h2>
          <p className="text-[15px] text-dust leading-[1.85] mb-4">
            A person who trains hard but eats destructively won't reach their potential. A person with a clear mind but no meaningful relationships will feel empty. The most powerful wellbeing gains come from working across dimensions — not going deep into one while the others decay.
          </p>
          <p className="text-[15px] text-dust leading-[1.85] mb-10">
            WellVerse isn't just a guide directory. It's an architecture for becoming the fullest version of yourself — built patiently, one vertical at a time.
          </p>
        </div>

        {/* Vertical list */}
        <div className="space-y-3">
          {verticals.map((v) => (
            <div
              key={v.id}
              onClick={() => navigate(`/vertical/${v.id}`)}
              className="flex items-center gap-5 p-4 rounded-2xl cursor-pointer transition-all hover:bg-white/[.04]"
              style={{ border: '1px solid rgba(255,255,255,.06)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${v.color}18` }}>
                {v.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-parchment">{v.label}</h3>
                <p className="text-[13px] text-mist">{v.tagline}</p>
              </div>
              <StatusPill vertical={v} />
            </div>
          ))}
        </div>
        </FadeInOnScroll>
      </Section>
    </div>
  )
}
