import { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { api } from '../api'
import { C } from '../tokens'
import Section from '../components/Section'
import Btn from '../components/Btn'

export default function Circles() {
  const { user } = useAuth()
  const [circles, setCircles] = useState([])
  const [verticals, setVerticals] = useState([])
  const [filterV, setFilterV] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    api.getVerticals().then(setVerticals).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = filterV ? { vertical_id: filterV } : {}
    api.getCircles(params).then(setCircles).catch(() => setCircles([])).finally(() => setLoading(false))
  }, [filterV])

  const handleJoin = async (id) => {
    setActionLoading(id)
    try {
      await api.joinCircle(id)
      setCircles((prev) => prev.map((c) => c.id === id ? { ...c, is_member: true, member_count: (c.member_count || 0) + 1 } : c))
    } catch { /* silent */ }
    finally { setActionLoading(null) }
  }

  const handleLeave = async (id) => {
    setActionLoading(id)
    try {
      await api.leaveCircle(id)
      setCircles((prev) => prev.map((c) => c.id === id ? { ...c, is_member: false, member_count: Math.max(0, (c.member_count || 1) - 1) } : c))
    } catch { /* silent */ }
    finally { setActionLoading(null) }
  }

  const isFree = user?.tier === 'free' || !user?.tier
  const joinedCount = circles.filter((c) => c.is_member).length

  return (
    <div data-tour="circles" style={{ background: C.void }}>
      <Section bg={C.void}>
        <div className="mb-9">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3">✦  Community Circles</p>
          <h1 className="font-display font-normal text-parchment mb-3" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>
            Grow <em className="text-gold">together.</em>
          </h1>
          <p className="text-[15px] text-mist max-w-[520px]">Join circles of like-minded people. Share experiences, support each other, and build accountability.</p>
        </div>

        {isFree && (
          <div className="mb-6 p-3 rounded-[10px] flex items-center gap-2.5" style={{ background: 'rgba(200,146,58,.07)', border: '1px solid rgba(200,146,58,.18)' }}>
            <span className="text-base">💡</span>
            <p className="text-[13px] text-amber"><strong>Free tier:</strong> You can join 1 circle. Upgrade to Committed for unlimited circles.</p>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setFilterV('')}
            className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer"
            style={{ border: `1px solid ${!filterV ? C.amber : 'rgba(255,255,255,.12)'}`, background: !filterV ? `${C.amber}22` : 'transparent', color: !filterV ? C.parchment : C.mist }}
          >
            All
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

        {loading ? (
          <p className="text-mist text-sm text-center py-16">Loading...</p>
        ) : circles.length === 0 ? (
          <div className="text-center py-20 text-mist">
            <div className="text-[42px] mb-3.5">🔵</div>
            <h3 className="font-display text-[26px] text-parchment mb-2.5">No circles found</h3>
            <p className="text-sm">Check back soon for new community circles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {circles.map((c) => {
              const full = c.max_members && c.member_count >= c.max_members
              const canJoin = user && !c.is_member && !full && !(isFree && joinedCount >= 1)
              return (
                <div key={c.id} className="rounded-[20px] p-6 flex flex-col" style={{ background: 'rgba(255,255,255,.025)', border: `1px solid ${c.vertical_color || 'rgba(255,255,255,.08)'}28` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-display text-lg text-parchment flex-1">{c.name}</h3>
                    {c.is_premium && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber/15 border border-amber/30 text-amber">Premium</span>
                    )}
                  </div>
                  <p className="text-[13px] text-dust leading-relaxed mb-4 flex-1">{c.description}</p>
                  <div className="flex items-center gap-3 mb-4 text-xs text-mist">
                    {c.schedule && <span>📅 {c.schedule}</span>}
                    <span>👥 {c.member_count || 0}{c.max_members ? `/${c.max_members}` : ''}</span>
                  </div>
                  {c.is_member ? (
                    <Btn v="ghost" onClick={() => handleLeave(c.id)} className="w-full !text-xs">
                      {actionLoading === c.id ? '...' : 'Leave Circle'}
                    </Btn>
                  ) : canJoin ? (
                    <Btn v="teal" onClick={() => handleJoin(c.id)} className="w-full !text-xs">
                      {actionLoading === c.id ? '...' : 'Join Circle'}
                    </Btn>
                  ) : (
                    <p className="text-[11px] text-mist text-center">{full ? 'Circle full' : !user ? 'Sign in to join' : 'Upgrade to join more'}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Section>
    </div>
  )
}
