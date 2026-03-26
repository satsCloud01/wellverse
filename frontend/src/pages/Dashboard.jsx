import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../api'
import { C } from '../tokens'
import Section from '../components/Section'
import Btn from '../components/Btn'
import Divider from '../components/Divider'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState([])
  const [report, setReport] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/signin'); return }
    Promise.all([
      api.getBookings().catch(() => []),
      api.getProgressReport().catch(() => null),
      api.getNotes().catch(() => []),
    ]).then(([b, r, n]) => {
      setBookings(b)
      setReport(r)
      setNotes(n)
    }).catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false))
  }, [user, authLoading, navigate])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.void }}>
        <p className="text-mist text-sm">Loading...</p>
      </div>
    )
  }

  if (!user) return null

  const upcoming = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending')

  return (
    <div data-tour="dashboard" style={{ background: C.void }}>
      <Section bg={C.void}>
        <div className="mb-10">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3">✦  Your Dashboard</p>
          <h1 className="font-display font-normal text-parchment" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>
            Welcome back, <em className="text-gold">{user.full_name?.split(' ')[0] || 'Explorer'}</em>
          </h1>
          <p className="text-sm text-mist mt-2">Here's what's happening in your WellVerse journey.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-[10px]" style={{ background: 'rgba(106,42,64,.15)', border: '1px solid rgba(106,42,64,.35)' }}>
            <p className="text-[13px] text-rose">{error}</p>
          </div>
        )}

        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          {/* Upcoming Bookings */}
          <div className="rounded-[20px] p-7" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}>
            <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-4">Upcoming Sessions</p>
            <Divider />
            <div className="mt-4">
              {upcoming.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-mist text-sm mb-3">No upcoming sessions</p>
                  <Btn v="ghost" onClick={() => navigate('/browse')}>Find a guide</Btn>
                </div>
              ) : (
                upcoming.slice(0, 4).map((b) => (
                  <div key={b.id} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
                    <span className="text-lg">{b.guide_emoji || '🧭'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-parchment font-medium truncate">{b.guide_name}</p>
                      <p className="text-xs text-mist">{b.date} &middot; {b.time}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{
                      background: b.status === 'confirmed' ? 'rgba(42,106,96,.2)' : 'rgba(200,146,58,.15)',
                      color: b.status === 'confirmed' ? C.pine : C.amber,
                      border: `1px solid ${b.status === 'confirmed' ? 'rgba(42,106,96,.4)' : 'rgba(200,146,58,.3)'}`,
                    }}>
                      {b.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Progress Report */}
          <div className="rounded-[20px] p-7" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}>
            <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-4">Progress Report</p>
            <Divider />
            <div className="mt-4">
              {!report ? (
                <p className="text-mist text-sm py-6 text-center">No progress data yet. Book a session to get started.</p>
              ) : (
                <>
                  {[
                    [report.total_sessions, 'Total Sessions'],
                    [report.total_hours, 'Hours Invested'],
                    [report.streak, 'Week Streak'],
                    [report.avg_mood, 'Avg Mood'],
                  ].map(([val, label]) => (
                    <div key={label} className="flex justify-between items-center mb-3.5">
                      <span className="font-display text-[22px] font-semibold text-gold">{val ?? '—'}</span>
                      <span className="text-xs text-mist">{label}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Recent Notes */}
          <div className="rounded-[20px] p-7" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}>
            <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-4">Recent Session Notes</p>
            <Divider />
            <div className="mt-4">
              {notes.length === 0 ? (
                <p className="text-mist text-sm py-6 text-center">No session notes yet.</p>
              ) : (
                notes.slice(0, 4).map((n) => (
                  <div key={n.id} className="py-3 border-b border-white/5 last:border-0">
                    <p className="text-sm text-parchment font-medium truncate">{n.title || 'Session Note'}</p>
                    <p className="text-xs text-mist mt-1 line-clamp-2">{n.content}</p>
                    <p className="text-[10px] text-mist/60 mt-1">{n.created_at?.split('T')[0]}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex gap-3 flex-wrap">
          <Btn v="ghost" onClick={() => navigate('/messages')}>Messages</Btn>
          <Btn v="ghost" onClick={() => navigate('/library')}>Library</Btn>
          <Btn v="ghost" onClick={() => navigate('/circles')}>Community Circles</Btn>
          <Btn v="ghost" onClick={() => navigate('/browse')}>Find a Guide</Btn>
        </div>
      </Section>
    </div>
  )
}
