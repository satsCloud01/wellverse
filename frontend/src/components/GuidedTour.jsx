import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export const LS_KEY = 'wellverse_tour_complete'

const STEPS = [
  { cat: '✦ Start', title: 'Welcome to WellVerse', sub: 'Your journey to self-investment starts here', body: 'Discover vetted guides, book sessions, join circles, and track your progress across 6 dimensions of wellness.', stats: '6 Dimensions · 14 Guides · 6 Circles · Library', type: 'full' },
  { target: 'nav', route: '/', cat: '🧭 Nav', title: 'Navigation', body: 'Adapts when you sign in — switching from discovery to your personal tools.' },
  { cat: '✦ Vision', title: 'Six Dimensions of Self-Investment', body: 'WellVerse is built around 6 interconnected pillars: Mind, Body, Nutrition, Relationships, Beauty, and Passion. Two are live today. Four are in early access — all of them matter.', type: 'full' },
  { target: '[data-tour="verticals"]', route: '/', cat: '🧠 Explore', title: 'Vertical Tabs', body: 'Click any vertical for guide types, stats, and status. Live = book. Early = waitlist.', tryIt: "Click 'Nutrition & Food'." },
  { target: '[data-tour="pricing"]', route: '/', cat: '💳 Pricing', title: 'Pricing Tiers', body: 'Free forever. Pay-per-session. Or $49/mo Committed for 10% off + unlimited circles.', tip: 'Every guide offers a free 30-min intro call.' },
  { target: '[data-tour="guides"]', route: '/', cat: '👤 Guides', title: 'Founding Guides', body: '4-step vetting. 30% declined. Click any card for profile, booking, reviews, messaging.' },
  { target: '[data-tour="search"]', route: '/browse', cat: '🔍 Search', title: 'Search Guides', body: 'Search by name, specialty, or method across all live guides.' },
  { target: '[data-tour="filters"]', route: '/browse', cat: '🔍 Filter', title: 'Filter by Vertical', body: 'Narrow to Mental Wellness or Fitness. More verticals launching soon.' },
  { target: '[data-tour="explore-grid"]', route: '/explore', cat: '🧠 All Six', title: 'All 6 Dimensions', body: "Live verticals: book today. Early access: join the waitlist." },
  { target: '[data-tour="for-guides"]', route: '/for-guides', cat: '🤝 Guides', title: 'For Practitioners', body: 'Discovery, payments, analytics, peer community — all built in.', tip: '85% revenue. Zero commission first 90 days.' },
  { target: '[data-tour="vetting"]', route: '/for-guides', cat: '🛡️ Trust', title: '4-Step Vetting', body: 'Application → Interview → Supervised sessions → Ongoing review.' },
  { target: '[data-tour="library"]', route: '/library', cat: '📚 Library', title: 'WellVerse Library', body: 'Articles, exercises, meditations by verified practitioners.' },
  { target: '[data-tour="circles"]', route: '/circles', cat: '🔮 Circles', title: 'Community Circles', body: 'Group sessions: mindfulness, training, creativity, and more.', tip: 'Free = 1 circle. Committed = unlimited.' },
  { target: '[data-tour="blog"]', route: '/blog', cat: '📝 Blog', title: 'Blog', body: 'Manifesto, vetting process, science of self-investment.' },
  { target: '[data-tour="signin-btn"]', cat: '🔐 Account', title: 'Sign Up Free', body: 'Unlock booking, messaging, notes, progress, and circles.', noAuth: true },
  { target: '[data-tour="dashboard"]', route: '/dashboard', cat: '📊 Dashboard', title: 'Dashboard', body: 'Bookings, progress, notes — all in one place.', auth: true },
  { target: '[data-tour="messages"]', route: '/messages', cat: '💬 Messages', title: 'Messaging', body: 'Message any guide directly.', auth: true },
  { cat: '📅 Booking', title: 'Booking & Reviews', body: 'Free intro calls auto-confirm. Paid sessions via Stripe. Leave star ratings after sessions.', tip: 'Start with a free intro call.', type: 'full' },
  { target: '[data-tour="settings"]', route: '/settings', cat: '⚙️ Settings', title: 'Settings', body: 'Profile, tier upgrade, payment history.', auth: true },
  { cat: '🎉 Done', title: "You're Ready!", sub: 'Self-investment begins now.', body: 'Browse guides and book your first free intro call.', stats: '✓ Booking · ✓ Messaging · ✓ Notes · ✓ Circles · ✓ Progress', type: 'complete' },
]

export default function GuidedTour({ isOpen, onClose }) {
  const [step, setStep] = useState(0)
  // Animated spotlight coords — these are what CSS transitions act on
  const [sx, setSx] = useState(0)
  const [sy, setSy] = useState(0)
  const [sw, setSw] = useState(0)
  const [sh, setSh] = useState(0)
  const [hasSpot, setHasSpot] = useState(false)
  const [visible, setVisible] = useState(false) // controls tooltip opacity
  const [blackout, setBlackout] = useState(false) // page-transition blackout

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user } = useAuth()
  const raf = useRef()
  const mounted = useRef(true)

  const s = STEPS[step]
  const isFull = s.type === 'full' || s.type === 'complete' || !s.target
  const skip = useCallback((st) => (st.auth && !user) || (st.noAuth && user), [user])

  // ── Smooth element tracker using rAF ──
  const track = useCallback(() => {
    if (!mounted.current) return
    const el = s.target ? document.querySelector(s.target) : null
    if (el) {
      const r = el.getBoundingClientRect()
      setSx(r.left - 8); setSy(r.top - 8); setSw(r.width + 16); setSh(r.height + 16)
      setHasSpot(true)
    } else {
      setHasSpot(false)
    }
    raf.current = requestAnimationFrame(track)
  }, [s])

  // ── Step lifecycle ──
  useEffect(() => {
    if (!isOpen) return
    mounted.current = true
    setVisible(false)
    setHasSpot(false)

    if (isFull) {
      // No target — just show centered card
      setTimeout(() => setVisible(true), 80)
      return
    }

    const needsNav = s.route && pathname !== s.route

    if (needsNav) {
      // Blackout → navigate → wait for render → scroll → track → reveal
      setBlackout(true)
      setTimeout(() => {
        navigate(s.route)
        setTimeout(() => {
          const el = document.querySelector(s.target)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          setTimeout(() => {
            setBlackout(false)
            raf.current = requestAnimationFrame(track)
            setTimeout(() => setVisible(true), 300)
          }, 500)
        }, 300)
      }, 250)
    } else {
      // Same page — scroll → track → reveal
      const el = document.querySelector(s.target)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => {
        raf.current = requestAnimationFrame(track)
        setTimeout(() => setVisible(true), 350)
      }, 100)
    }

    return () => { mounted.current = false; cancelAnimationFrame(raf.current) }
  }, [isOpen, step])

  // Keyboard
  useEffect(() => {
    if (!isOpen) return
    const h = (e) => { if (e.key === 'Escape') end(); if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') back() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [isOpen, step])

  const go = useCallback((dir) => {
    setVisible(false)
    cancelAnimationFrame(raf.current)
    setTimeout(() => {
      let n = step + dir
      while (n >= 0 && n < STEPS.length && skip(STEPS[n])) n += dir
      if (n < 0 || n >= STEPS.length) { end(); return }
      setStep(n)
    }, 200)
  }, [step, skip])

  const next = () => go(1)
  const back = () => go(-1)
  const end = () => { localStorage.setItem(LS_KEY, 'true'); setStep(0); onClose() }

  if (!isOpen) return null

  const pct = ((step + 1) / STEPS.length) * 100

  // Tooltip position
  let tipStyle = {}
  if (isFull || !hasSpot) {
    tipStyle = { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: s.type ? 420 : 340 }
  } else {
    const above = sy > window.innerHeight * 0.5
    const tw = 330
    let tl = sx + sw / 2 - tw / 2
    tl = Math.max(12, Math.min(tl, window.innerWidth - tw - 12))
    tipStyle = {
      position: 'fixed',
      top: above ? sy - 14 : sy + sh + 14,
      left: tl,
      width: tw,
      transform: above ? 'translateY(-100%)' : 'none',
    }
  }

  return (
    <>
      {/* Blackout for page transitions */}
      <div className="fixed inset-0 z-[9997] pointer-events-none" style={{
        background: '#0A0A08',
        opacity: blackout ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />

      {/* Overlay + Spotlight */}
      <div className="fixed inset-0 z-[9998]" onClick={end}>
        {hasSpot && !isFull ? (
          <div style={{
            position: 'fixed', left: sx, top: sy, width: sw, height: sh,
            borderRadius: 10,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
            border: '1.5px solid rgba(200,146,58,0.4)',
            transition: 'all 0.45s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: 'none',
          }} />
        ) : (
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(3px)' }} />
        )}
      </div>

      {/* Tooltip */}
      <div
        className="z-[9999]"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...tipStyle,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease, top 0.4s cubic-bezier(0.4,0,0.2,1), left 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.3s ease',
        }}
      >
        <div style={{
          background: 'rgba(17,20,16,0.96)',
          border: '1px solid rgba(200,146,58,0.1)',
          borderRadius: 12,
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}>
          {/* Progress */}
          <div style={{ height: 2, background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#C8923A,#E2B96F)', transition: 'width 0.4s ease' }} />
          </div>

          <div style={{ padding: s.type ? '24px 24px 20px' : '16px 18px 14px' }}>
            {/* Category + counter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: s.type ? 14 : 8 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '2px 7px', borderRadius: 12, background: 'rgba(200,146,58,0.08)', color: '#C8923A', border: '1px solid rgba(200,146,58,0.1)' }}>{s.cat}</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)' }}>{step + 1}/{STEPS.length}</span>
            </div>

            {/* Welcome/Complete icon */}
            {s.type && s.type !== 'full' && (
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 36 }}>{s.type === 'complete' ? '🎉' : '✦'}</span>
              </div>
            )}
            {s.type === 'full' && step === 0 && (
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <div style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', fontSize: 18, background: 'linear-gradient(135deg,#3A5A40,#C8923A)' }}>✦</div>
              </div>
            )}

            {/* Title */}
            <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: s.type ? 22 : 16, fontWeight: s.type ? 400 : 600, color: '#F2EDE4', marginBottom: 2, textAlign: s.type ? 'center' : 'left', lineHeight: 1.2 }}>{s.title}</h3>

            {s.sub && <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 13, fontStyle: 'italic', color: '#E2B96F', textAlign: 'center', marginBottom: 6 }}>{s.sub}</p>}

            <p style={{ fontSize: 12, color: '#8A9E96', lineHeight: 1.6, marginBottom: 8, textAlign: s.type ? 'center' : 'left' }}>{s.body}</p>

            {s.stats && (
              <div style={{ textAlign: 'center', padding: '6px 12px', borderRadius: 8, background: 'rgba(42,106,96,0.06)', border: '1px solid rgba(42,106,96,0.12)', marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: '#3A9A78', fontWeight: 500 }}>{s.stats}</span>
              </div>
            )}

            {s.tip && (
              <div style={{ display: 'flex', gap: 5, padding: '5px 8px', borderRadius: 6, background: 'rgba(42,106,96,0.05)', border: '1px solid rgba(42,106,96,0.1)', marginBottom: 6 }}>
                <span style={{ fontSize: 10 }}>💡</span>
                <span style={{ fontSize: 10, color: '#3A9A78', lineHeight: 1.5 }}>{s.tip}</span>
              </div>
            )}

            {s.tryIt && (
              <div style={{ display: 'flex', gap: 5, padding: '5px 8px', borderRadius: 6, background: 'rgba(200,146,58,0.04)', border: '1px solid rgba(200,146,58,0.08)', marginBottom: 6 }}>
                <span style={{ fontSize: 10 }}>👆</span>
                <span style={{ fontSize: 10, color: '#E2B96F', lineHeight: 1.5 }}>{s.tryIt}</span>
              </div>
            )}

            {/* Nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <button onClick={back} disabled={step === 0} style={{ width: 24, height: 24, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, border: 'none', cursor: step > 0 ? 'pointer' : 'default', background: step > 0 ? 'rgba(255,255,255,0.05)' : 'transparent', color: step > 0 ? '#C4BAA8' : 'rgba(255,255,255,0.06)', fontFamily: 'system-ui' }}>←</button>

              {/* Dots */}
              <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{ width: i === step ? 10 : 3, height: 3, borderRadius: 1.5, background: i === step ? '#C8923A' : i < step ? 'rgba(200,146,58,0.2)' : 'rgba(255,255,255,0.05)', transition: 'all 0.3s' }} />
                ))}
              </div>

              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {!s.type && <button onClick={end} style={{ fontSize: 9, border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.12)', fontFamily: "'Outfit',sans-serif" }}>Skip</button>}
                {s.type === 'complete' ? (
                  <>
                    <button onClick={() => { onClose(); navigate('/browse') }} style={{ padding: '4px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#C8923A,#E2B96F)', color: '#fff', fontFamily: "'Outfit',sans-serif" }}>Browse Guides</button>
                    <button onClick={onClose} style={{ padding: '4px 8px', borderRadius: 5, fontSize: 10, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: '#C4BAA8', fontFamily: "'Outfit',sans-serif" }}>Close</button>
                  </>
                ) : (
                  <button onClick={next} style={{ padding: '4px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#2A6A60,#3A9A78)', color: '#fff', fontFamily: "'Outfit',sans-serif" }}>
                    {step === 0 ? 'Begin →' : 'Next →'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
