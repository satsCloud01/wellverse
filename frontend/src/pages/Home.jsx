import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { C, WORDS, TIERS } from '../tokens'
import Section from '../components/Section'
import Btn from '../components/Btn'
import Divider from '../components/Divider'
import GuideCard from '../components/GuideCard'
import { FloatingParticles, FadeInOnScroll } from '../components/AmbientBg'

export default function Home({ onOpenGuide }) {
  const navigate = useNavigate()
  const [wi, setWi] = useState(0)
  const [verticals, setVerticals] = useState([])
  const [activeV, setActiveV] = useState('mind')
  const [guides, setGuides] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.getVerticals().then(setVerticals).catch(() => {})
    api.getGuides({ preview: false }).then(setGuides).catch(() => {})
    api.getStats().then(setStats).catch(() => {})
    const t = setInterval(() => setWi((i) => (i + 1) % WORDS.length), 2100)
    return () => clearInterval(t)
  }, [])

  const v = verticals.find((x) => x.id === activeV)
  const liveVerticals = verticals.filter((x) => x.status === 'live')
  const earlyVerticals = verticals.filter((x) => x.status === 'early')

  return (
    <div>
      {/* HERO — Full-screen video background (Colossal-inspired) */}
      <section data-tour="hero" className="relative min-h-screen flex items-center px-[6%] overflow-hidden ambient-grain">
        {/* Floating particles over video */}
        <FloatingParticles count={30} color="rgba(226,185,111,0.35)" className="z-[2]" />
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover video-zoom"
          style={{ zIndex: 0, transformOrigin: 'center center' }}
          poster="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=80"
        >
          <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        </video>
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background: 'linear-gradient(135deg, rgba(10,10,8,.88) 0%, rgba(10,10,8,.72) 40%, rgba(10,20,14,.82) 100%)',
          }}
        />
        {/* Accent light effects over video */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 2,
            background: 'radial-gradient(ellipse 55% 55% at 70% 50%, rgba(42,106,96,.15) 0%, transparent 60%), radial-gradient(ellipse 35% 35% at 15% 25%, rgba(200,146,58,.08) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 scroll-hint" style={{ zIndex: 3 }}>
          <span className="text-[11px] tracking-[3px] text-mist/60 uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>

        <div className="relative max-w-[1240px] mx-auto w-full grid gap-14 items-center" style={{ zIndex: 3, gridTemplateColumns: '1fr 390px' }}>
          <div>
            <div className="fu text-[11px] font-bold tracking-[3px] text-amber uppercase mb-5">✦  Building WellVerse — 6 Dimensions of Self</div>
            <h1 className="fu d1 font-display font-light leading-none mb-1.5" style={{ fontSize: 'clamp(46px,6vw,86px)' }}>Invest in your</h1>
            <div className="font-display font-semibold leading-tight mb-7 overflow-hidden" style={{ fontSize: 'clamp(46px,6vw,86px)', height: '1.15em' }}>
              <span className="wc text-shimmer italic">{WORDS[wi]}</span>
            </div>
            <p className="fu d2 text-lg text-dust leading-[1.85] max-w-[510px] mb-3">Self-investment doesn't live in one dimension.</p>
            <p className="fu d2 text-[15px] text-mist leading-[1.85] max-w-[510px] mb-10 italic">
              We're building WellVerse across six pillars — Mind, Body, Nutrition, Relationships, Beauty, and Passion. Two are live. Four are in early access. All of them matter.
            </p>
            <div className="fu d3 flex gap-3 flex-wrap mb-8">
              <Btn v="gold" onClick={() => navigate('/explore')}>Explore All 6 Verticals →</Btn>
              <Btn v="ghost" onClick={() => navigate('/browse')}>Browse Live Guides →</Btn>
            </div>
            {/* Status indicators */}
            <div className="fu d3 flex flex-col gap-2.5">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-[10px]" style={{ background: 'rgba(42,106,96,.1)', border: '1px solid rgba(42,106,96,.25)', backdropFilter: 'blur(12px)' }}>
                <span className="text-[13px] text-pine font-semibold">✓ 2 verticals live now</span>
                <span className="text-[13px] text-mist">Mind + Body — book today</span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-[10px]" style={{ background: 'rgba(200,146,58,.08)', border: '1px solid rgba(200,146,58,.2)', backdropFilter: 'blur(12px)' }}>
                <span className="text-[13px] text-amber font-semibold">⏳ 4 verticals in early access</span>
                <span className="text-[13px] text-mist">Nutrition · Relationships · Beauty · Passion Circles</span>
              </div>
            </div>
          </div>

          {/* Stats panel — glass morphism over video */}
          <div className="rounded-[20px] p-7 border-breathe" style={{ background: 'rgba(17,20,16,.65)', border: '1px solid rgba(255,255,255,.1)', backdropFilter: 'blur(20px)' }}>
            <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-4">WellVerse Today</p>
            <p className="font-display text-[13px] italic text-dust leading-[1.7] mb-4">"These are real numbers. We're early — and that's exactly why now is the right time."</p>
            <Divider />
            {stats && (
              <div className="mt-4">
                {[
                  [stats.founding_members, 'Founding Members'],
                  [stats.vetted_guides, 'Vetted Guides'],
                  [stats.intro_sessions, 'Intro Sessions'],
                  [stats.avg_rating, 'Avg Rating'],
                ].map(([n, l]) => (
                  <div key={l} className="flex justify-between items-center mb-4">
                    <span className="font-display text-[28px] font-semibold text-gold">{n}</span>
                    <span className="text-xs text-mist text-right max-w-[130px]">{l}</span>
                  </div>
                ))}
              </div>
            )}
            <Divider />
            <div className="mt-3.5 p-3 rounded-[10px]" style={{ background: 'rgba(42,106,96,.15)', border: '1px solid rgba(42,106,96,.3)' }}>
              <p className="text-xs text-pine font-semibold mb-0.5">✓  Every guide personally vetted</p>
              <p className="text-xs text-mist">124 applied · 87 approved · 37 declined</p>
            </div>
          </div>
        </div>
      </section>

      {/* VERTICALS — All 6 */}
      <Section bg={C.ember} ambient="orbs-teal aurora">
        <div className="max-w-[700px] mb-12">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3.5">The WellVerse Model</p>
          <h2 className="font-display font-normal leading-tight mb-3.5" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>Six dimensions. One platform.</h2>
          <p className="text-[15px] text-dust leading-[1.85]">
            Self-investment is not one thing. It's a practice across every dimension of what it means to be a full human being.
          </p>
        </div>
        <div data-tour="verticals" className="flex gap-2.5 mb-7 flex-wrap">
          {verticals.map((vt) => {
            const active = activeV === vt.id
            return (
              <button
                key={vt.id}
                onClick={() => setActiveV(vt.id)}
                className="px-5 py-2 rounded-full text-[13px] font-medium border cursor-pointer transition-all"
                style={{
                  background: active ? `${vt.color}22` : 'transparent',
                  color: active ? vt.accent : C.mist,
                  borderColor: active ? vt.color : 'rgba(255,255,255,.12)',
                }}
              >
                {vt.emoji} {vt.label}
                {vt.status === 'early' && <span className="ml-1.5 text-[10px] opacity-60">⏳</span>}
              </button>
            )
          })}
        </div>
        {v && (
          <div
            className="rounded-[20px] p-8 grid gap-10"
            style={{ background: 'rgba(255,255,255,.025)', border: `1px solid ${v.color}28`, gridTemplateColumns: '1fr 1fr' }}
          >
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <p className="text-xs font-bold tracking-[2px] uppercase" style={{ color: v.accent }}>{v.emoji} {v.label}</p>
                {v.status === 'live' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pine/20 border border-pine/40 text-pine">✓ Live</span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${v.color}15`, border: `1px solid ${v.color}35`, color: v.accent }}>{v.eta}</span>
                )}
              </div>
              <p className="text-sm text-mist mb-3 italic">{v.tagline}</p>
              <p className="text-[15px] text-dust leading-[1.85] mb-4">{v.why}</p>
              <div className="p-3 rounded-lg mb-5" style={{ background: `${v.color}15`, border: `1px solid ${v.color}30` }}>
                <p className="text-xs font-medium" style={{ color: v.accent }}>📊  {v.stat}</p>
              </div>
              {v.status === 'live' ? (
                <Btn v="gold" onClick={() => navigate('/browse')}>Browse guides now</Btn>
              ) : (
                <Btn v="ghost" onClick={() => navigate(`/vertical/${v.id}`)}>Join waitlist</Btn>
              )}
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-3.5">Guide Types</p>
              {v.guide_types?.map((g, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-white/5">
                  <div className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: v.accent }} />
                  <span className="text-sm text-dust">{g}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* PRICING */}
      <Section bg={C.void} ambient="orbs-gold grain">
        <FadeInOnScroll>
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3.5">Start Free</p>
          <h2 className="font-display font-normal text-parchment mb-3.5" style={{ fontSize: 'clamp(28px,4vw,48px)' }}>No commitment required.</h2>
          <p className="text-[15px] text-mist max-w-[480px] mx-auto">
            The first step into self-investment shouldn't cost you anything.
          </p>
        </div>
        </FadeInOnScroll>
        <div data-tour="pricing" className="grid grid-cols-3 gap-5">
          {TIERS.map((t) => {
            const hot = t.badge === 'MOST POPULAR'
            return (
              <div
                key={t.id}
                className="rounded-[20px] p-7 relative flex flex-col"
                style={{
                  background: hot ? 'rgba(200,146,58,.07)' : 'rgba(255,255,255,.025)',
                  border: hot ? `2px solid ${C.amber}` : '1px solid rgba(255,255,255,.08)',
                }}
              >
                {hot && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber text-white text-[11px] font-bold tracking-wider px-4 py-1 rounded-full whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-2">{t.name}</p>
                  <p className="font-display text-[26px] font-semibold" style={{ color: hot ? C.gold : C.parchment }}>{t.price}</p>
                </div>
                <div className="flex-1 mb-5">
                  {t.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2.5 mb-2.5">
                      <span className="text-sage text-[13px] mt-0.5 shrink-0">✓</span>
                      <span className="text-[13px] text-dust leading-relaxed">{perk}</span>
                    </div>
                  ))}
                </div>
                <Btn v={hot ? 'gold' : t.id === 'free' ? 'teal' : 'ghost'} onClick={() => navigate('/browse')} className="w-full !text-sm">
                  {t.id === 'free' ? 'Start Exploring Free' : t.id === 'sessions' ? 'Find a Guide' : 'Start 14-Day Trial'}
                </Btn>
                <p className="text-[11px] text-mist text-center mt-2.5">{t.note}</p>
              </div>
            )
          })}
        </div>
      </Section>

      {/* GUIDES PREVIEW */}
      <Section bg={C.ink} ambient="pulse grain">
        <div className="flex justify-between items-end mb-11">
          <div>
            <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3">Founding Guides</p>
            <h2 className="font-display font-normal" style={{ fontSize: 'clamp(26px,3.5vw,44px)' }}>Real people. Verified credentials.</h2>
            <p className="text-sm text-mist mt-2 max-w-[480px]">
              These practitioners joined before launch because they believe in what we're building — not because we paid for their presence.
            </p>
          </div>
          <button
            onClick={() => navigate('/browse')}
            className="px-5 py-2.5 rounded-[10px] text-[13px] bg-transparent border border-white/[.14] text-dust cursor-pointer"
          >
            All guides →
          </button>
        </div>
        <div data-tour="guides" className="grid grid-cols-4 gap-4">
          {guides.map((g) => (
            <GuideCard key={g.id} guide={g} onOpen={onOpenGuide} />
          ))}
        </div>
      </Section>
    </div>
  )
}
