import { useEffect, useState } from 'react'
import { api } from '../api'
import { C } from '../tokens'
import Section from '../components/Section'
import Divider from '../components/Divider'

const TYPE_COLORS = {
  article: { bg: 'rgba(42,106,96,.15)', border: 'rgba(42,106,96,.35)', color: C.pine },
  video: { bg: 'rgba(74,122,154,.15)', border: 'rgba(74,122,154,.35)', color: C.skylt },
  exercise: { bg: 'rgba(200,146,58,.12)', border: 'rgba(200,146,58,.3)', color: C.amber },
  meditation: { bg: 'rgba(90,58,106,.15)', border: 'rgba(90,58,106,.35)', color: C.plmAcc },
}

export default function Library() {
  const [items, setItems] = useState([])
  const [verticals, setVerticals] = useState([])
  const [filterV, setFilterV] = useState('')
  const [filterType, setFilterType] = useState('')
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getVerticals().then(setVerticals).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (filterV) params.vertical_id = filterV
    if (filterType) params.content_type = filterType
    api.getLibrary(params).then(setItems).catch(() => setItems([])).finally(() => setLoading(false))
  }, [filterV, filterType])

  const openDetail = (item) => {
    setSelected(item.id)
    api.getLibraryItem(item.id).then(setDetail).catch(() => setDetail(item))
  }

  if (selected && detail) {
    return (
      <div style={{ background: C.void }}>
        <Section bg={C.void}>
          <button
            onClick={() => { setSelected(null); setDetail(null) }}
            className="text-[13px] text-amber cursor-pointer bg-transparent border-none font-body mb-6"
          >
            ← Back to Library
          </button>
          <div className="max-w-[720px]">
            <div className="flex items-center gap-2.5 mb-3">
              {(() => {
                const tc = TYPE_COLORS[detail.content_type] || TYPE_COLORS.article
                return (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.color }}>
                    {detail.content_type}
                  </span>
                )
              })()}
              {detail.duration_minutes && <span className="text-xs text-mist">{detail.duration_minutes} min</span>}
            </div>
            <h1 className="font-display font-normal text-parchment mb-3" style={{ fontSize: 'clamp(26px,3.5vw,40px)' }}>{detail.title}</h1>
            <p className="text-sm text-mist mb-2">By {detail.author || 'WellVerse'}</p>
            <Divider />
            <div className="mt-6 text-[15px] text-dust leading-[1.9]">
              {(detail.body || detail.description || '').split('\n').map((line, i) => {
                if (line.startsWith('### ')) return <h3 key={i} className="font-display text-lg text-parchment mt-6 mb-2">{line.slice(4)}</h3>
                if (line.startsWith('## ')) return <h2 key={i} className="font-display text-xl text-parchment mt-7 mb-3">{line.slice(3)}</h2>
                if (line.startsWith('# ')) return <h1 key={i} className="font-display text-2xl text-parchment mt-8 mb-3">{line.slice(2)}</h1>
                if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1">{line.slice(2)}</li>
                if (!line.trim()) return <br key={i} />
                return <p key={i} className="mb-2">{line}</p>
              })}
            </div>
          </div>
        </Section>
      </div>
    )
  }

  return (
    <div data-tour="library" style={{ background: C.void }}>
      <Section bg={C.void}>
        <div className="mb-9">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3">✦  WellVerse Library</p>
          <h1 className="font-display font-normal text-parchment mb-3" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>
            Curated resources for your <em className="text-gold">growth.</em>
          </h1>
          <p className="text-[15px] text-mist max-w-[520px]">Articles, exercises, meditations, and videos — created by our vetted guides.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setFilterV('')}
            className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer"
            style={{ border: `1px solid ${!filterV ? C.amber : 'rgba(255,255,255,.12)'}`, background: !filterV ? `${C.amber}22` : 'transparent', color: !filterV ? C.parchment : C.mist }}
          >
            All Verticals
          </button>
          {verticals.map((v) => (
            <button
              key={v.id}
              onClick={() => setFilterV(filterV === v.id ? '' : v.id)}
              className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer"
              style={{ border: `1px solid ${filterV === v.id ? v.color : 'rgba(255,255,255,.12)'}`, background: filterV === v.id ? `${v.color}22` : 'transparent', color: filterV === v.id ? C.parchment : C.mist }}
            >
              {v.emoji} {v.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap mb-8">
          {['', 'article', 'video', 'exercise', 'meditation'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(filterType === t ? '' : t)}
              className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer"
              style={{ border: `1px solid ${filterType === t ? 'rgba(200,146,58,.4)' : 'rgba(255,255,255,.12)'}`, background: filterType === t ? 'rgba(200,146,58,.1)' : 'transparent', color: filterType === t ? C.gold : C.mist }}
            >
              {t || 'All Types'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-mist text-sm text-center py-16">Loading...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-mist">
            <div className="text-[42px] mb-3.5">📚</div>
            <h3 className="font-display text-[26px] text-parchment mb-2.5">No items found</h3>
            <p className="text-sm">Try different filters.</p>
          </div>
        ) : (
          <>
            <p className="text-[13px] text-mist mb-5">{items.length} items</p>
            <div className="grid grid-cols-3 gap-4">
              {items.map((item) => {
                const tc = TYPE_COLORS[item.content_type] || TYPE_COLORS.article
                return (
                  <div
                    key={item.id}
                    onClick={() => openDetail(item)}
                    className="rounded-[20px] p-6 cursor-pointer transition-all hover:brightness-110"
                    style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.color }}>
                        {item.content_type}
                      </span>
                      {item.duration_minutes && <span className="text-[11px] text-mist">{item.duration_minutes} min</span>}
                    </div>
                    <h3 className="font-display text-lg text-parchment mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-[13px] text-dust leading-relaxed line-clamp-3 mb-3">{item.description}</p>
                    <p className="text-[11px] text-mist">{item.author || 'WellVerse'}</p>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </Section>
    </div>
  )
}
