import { useNavigate } from 'react-router-dom'
import { C, GUIDE_REASONS, VET_STEPS } from '../tokens'
import Section from '../components/Section'
import Btn from '../components/Btn'
import { FloatingParticles } from '../components/AmbientBg'

export default function ForGuides() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <section
        data-tour="for-guides"
        className="px-[6%] pt-24 pb-20 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${C.ember} 0%, #0A1A14 100%)` }}
      >
        <FloatingParticles count={18} color="rgba(58,154,120,0.25)" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 60% at 78% 50%, rgba(42,106,96,.15) 0%, transparent 60%)' }} />
        <div className="max-w-[1100px] mx-auto relative">
          <div className="inline-block px-3.5 py-1.5 rounded-full mb-5" style={{ background: 'rgba(42,106,96,.2)', border: '1px solid rgba(58,122,104,.35)' }}>
            <span className="text-[11px] font-bold tracking-[2px] text-pine uppercase">For Practitioners & Guides</span>
          </div>
          <h1 className="font-display font-light leading-tight mb-5" style={{ fontSize: 'clamp(34px,5vw,64px)' }}>
            You already have the skills.<br />We handle everything else.
          </h1>
          <p className="text-base text-dust max-w-[560px] leading-[1.9] mb-3">
            Calendly handles scheduling. Instagram handles vanity metrics. Neither was built for the serious work of helping someone change their life.
          </p>
          <p className="text-sm text-mist max-w-[520px] leading-[1.9] mb-10 italic">
            WellVerse gives you the discovery, trust signals, and workflow tools that actually grow a practice.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Btn v="teal" onClick={() => navigate('/apply')}>Apply to Be a Guide →</Btn>
            <Btn v="ghost">See Pricing</Btn>
          </div>
        </div>
      </section>

      {/* Why WellVerse */}
      <Section bg={C.void} ambient="orbs-teal grain">
        <div className="text-center mb-11">
          <h2 className="font-display font-normal text-parchment mb-3" style={{ fontSize: 'clamp(26px,3.5vw,44px)' }}>
            <em className="text-pine">Why WellVerse</em> over Calendly + Instagram?
          </h2>
          <p className="text-[15px] text-mist max-w-[440px] mx-auto">A fair question. An honest answer.</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {GUIDE_REASONS.map((r, i) => (
            <div key={i} className="bg-white/[.03] border border-white/[.07] rounded-2xl p-6 transition-all hover:bg-teal/[.08] hover:border-teal/30">
              <div className="text-[26px] mb-3">{r.icon}</div>
              <h3 className="font-display text-lg font-semibold text-parchment mb-2">{r.title}</h3>
              <p className="text-[13px] text-mist leading-[1.75]">{r.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Verification */}
      <Section bg={C.ember} ambient="pulse">
        <div className="max-w-[640px] mb-11">
          <p className="text-[11px] font-bold tracking-[3px] text-pine uppercase mb-3">Verification</p>
          <h2 className="font-display font-normal leading-tight mb-3" style={{ fontSize: 'clamp(24px,3.5vw,44px)' }}>
            The process clients trust — and guides are proud of.
          </h2>
          <p className="text-sm text-dust leading-[1.85]">30% of applicants are declined. That's not a bug — it's the whole point.</p>
        </div>
        <div data-tour="vetting" className="grid grid-cols-4 gap-4">
          {VET_STEPS.map((step, i) => (
            <div key={i} className="bg-white/[.03] border border-teal/20 rounded-2xl p-5">
              <div className="font-display text-[44px] font-bold leading-none mb-[-6px]" style={{ color: 'rgba(42,106,96,.2)' }}>{step.n}</div>
              <div className="text-2xl mb-3">{step.icon}</div>
              <h3 className="font-display text-base font-semibold text-parchment mb-2">{step.title}</h3>
              <p className="text-xs text-mist leading-[1.7]">{step.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Economics */}
      <Section bg="#0A1A14" className="text-center" ambient="orbs-gold">
        <div className="max-w-[640px] mx-auto">
          <h2 className="font-display font-normal text-parchment mb-9" style={{ fontSize: 'clamp(24px,3.5vw,44px)' }}>The economics.</h2>
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[['0%', 'Commission for first 90 days'], ['15%', 'After that (below market)'], ['85%', 'Yours. Always.']].map(([n, l]) => (
              <div key={n} className="rounded-[14px] p-6 text-center" style={{ background: 'rgba(42,106,96,.08)', border: '1px solid rgba(42,106,96,.25)' }}>
                <div className="font-display text-[38px] font-semibold text-pine mb-2">{n}</div>
                <p className="text-[13px] text-mist">{l}</p>
              </div>
            ))}
          </div>
          <Btn v="teal" onClick={() => navigate('/apply')} className="!px-10 !py-3.5 !text-[15px]">Apply to Join WellVerse →</Btn>
        </div>
      </Section>
    </div>
  )
}
