import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../api'
import Divider from './Divider'

export default function Footer() {
  const navigate = useNavigate()
  const [verticals, setVerticals] = useState([])

  useEffect(() => {
    api.getVerticals().then(setVerticals).catch(() => {})
  }, [])

  const cols = [
    { title: 'Verticals', links: verticals.map((v) => [`${v.emoji} ${v.label}`, `/vertical/${v.id}`]) },
    { title: 'For Seekers', links: [['Browse Guides', '/browse'], ['Library', '/library'], ['Community Circles', '/circles'], ['Blog', '/blog']] },
    { title: 'For Guides', links: [['Why WellVerse?', '/for-guides'], ['Apply Now', '/apply'], ['Verification', '/for-guides'], ['Economics', '/for-guides']] },
    { title: 'Company', links: [['Our Manifesto', '/blog/why-we-built-wellverse'], ['Roadmap', '/explore'], ['Blog', '/blog'], ['Contact', '/']] },
  ]

  return (
    <footer className="px-[6%] pt-12 pb-8" style={{ background: '#0A0A08', borderTop: '1px solid rgba(255,255,255,.06)' }}>
      <div className="max-w-[1240px] mx-auto">
        <div className="grid gap-x-8 gap-y-10 mb-10" style={{ gridTemplateColumns: '1fr repeat(4, auto)' }}>
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[13px]" style={{ background: 'linear-gradient(135deg,#3A5A40,#C8923A)' }}>
                ✦
              </div>
              <span className="font-display text-[19px] font-semibold text-parchment">WellVerse</span>
            </div>
            <p className="text-[13px] text-mist leading-[1.8] max-w-[200px] mb-3.5">
              Six dimensions of self-investment. Two live. Four coming.
            </p>
            <div className="p-2.5 rounded-lg" style={{ background: 'rgba(42,106,96,.12)', border: '1px solid rgba(42,106,96,.25)' }}>
              <p className="text-[11px] text-pine">✓ Early Access · Free intro calls · 90-day zero commission</p>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold text-white/[.28] tracking-[2px] uppercase mb-3.5">{col.title}</h4>
              {col.links.map(([label, path]) => (
                <div
                  key={label}
                  onClick={() => navigate(path)}
                  className="text-[13px] text-mist mb-2 cursor-pointer hover:text-gold transition-colors"
                >
                  {label}
                </div>
              ))}
            </div>
          ))}
        </div>

        <Divider />
        <div className="flex justify-between items-center mt-5">
          <p className="text-xs text-white/20">© 2025 WellVerse. Built honestly, for the long game.</p>
          <div className="flex gap-4">
            <span onClick={() => navigate('/privacy')} className="text-xs text-white/20 cursor-pointer hover:text-white/40 transition-colors">Privacy</span>
            <span onClick={() => navigate('/terms')} className="text-xs text-white/20 cursor-pointer hover:text-white/40 transition-colors">Terms</span>
            <span className="text-xs text-white/20 cursor-pointer hover:text-white/40 transition-colors">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
