import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { C } from '../tokens'
import GuideCard from '../components/GuideCard'

export default function Browse({ onOpenGuide }) {
  const navigate = useNavigate()
  const [guides, setGuides] = useState([])
  const [verticals, setVerticals] = useState([])
  const [search, setSearch] = useState('')
  const [filterV, setFilterV] = useState(null)

  useEffect(() => {
    api.getGuides({ preview: false }).then(setGuides).catch(() => {})
    api.getVerticals().then(setVerticals).catch(() => {})
  }, [])

  const liveVerticals = verticals.filter((v) => v.status === 'live')
  const filtered = guides.filter((g) => {
    const vm = !filterV || g.vertical_id === filterV
    const sm = !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.role.toLowerCase().includes(search.toLowerCase()) || g.methods.some((m) => m.toLowerCase().includes(search.toLowerCase()))
    return vm && sm
  })

  return (
    <div className="px-[6%] py-16 max-w-[1240px] mx-auto">
      <div className="mb-9">
        <p className="text-[11px] tracking-[3px] text-amber uppercase mb-3">Find Your Guide</p>
        <h1 className="font-display font-normal mb-5" style={{ fontSize: 'clamp(30px,4.5vw,50px)' }}>
          Every guide, <em className="text-gold">personally vetted.</em>
        </h1>
        <div data-tour="search" className="flex items-center gap-2.5 max-w-[480px] pl-4 pr-2 py-2 bg-white/[.04] border border-white/10 rounded-[14px]">
          <span className="text-mist">◎</span>
          <input
            className="flex-1 text-[15px] bg-transparent border-none outline-none text-parchment font-body placeholder:text-mist"
            placeholder="Name, method, specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="bg-white/[.08] border-none text-dust rounded-lg px-3 py-1.5 cursor-pointer text-xs">Clear</button>
          )}
        </div>
      </div>

      <div data-tour="filters" className="flex gap-2 flex-wrap mb-2.5">
        <button
          onClick={() => setFilterV(null)}
          className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer"
          style={{
            border: `1px solid ${!filterV ? C.amber : 'rgba(255,255,255,.12)'}`,
            background: !filterV ? `${C.amber}22` : 'transparent',
            color: !filterV ? C.parchment : C.mist,
          }}
        >
          All Guides
        </button>
        {liveVerticals.map((v) => {
          const active = filterV === v.id
          return (
            <button
              key={v.id}
              onClick={() => setFilterV(active ? null : v.id)}
              className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer"
              style={{
                border: `1px solid ${active ? v.color : 'rgba(255,255,255,.12)'}`,
                background: active ? `${v.color}22` : 'transparent',
                color: active ? C.parchment : C.mist,
              }}
            >
              {v.emoji} {v.label}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2.5 p-2.5 rounded-[10px] mb-4" style={{ background: 'rgba(200,146,58,.07)', border: '1px solid rgba(200,146,58,.18)' }}>
        <span className="text-base">⏳</span>
        <p className="text-[13px] text-amber">
          <strong>Nutrition, Relationships, Beauty & Passion Circles coming soon.</strong>{' '}
          <span className="cursor-pointer underline" onClick={() => navigate('/explore')}>Join those waitlists →</span>
        </p>
      </div>

      <div className="flex items-center gap-2.5 p-2.5 rounded-[10px] mb-6" style={{ background: 'rgba(42,106,96,.07)', border: '1px solid rgba(42,106,96,.2)' }}>
        <span className="text-base">🎁</span>
        <p className="text-[13px] text-pine"><strong>Every guide offers a free 30-min intro call.</strong> No booking fee. No commitment.</p>
      </div>

      <p className="text-[13px] text-mist mb-6">{filtered.length} live guides</p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {filtered.map((g) => (
            <GuideCard key={g.id} guide={g} onOpen={onOpenGuide} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-mist">
          <div className="text-[42px] mb-3.5">◎</div>
          <h3 className="font-display text-[26px] text-parchment mb-2.5">No guides found</h3>
          <p className="text-sm">Try different search terms.</p>
        </div>
      )}
    </div>
  )
}
