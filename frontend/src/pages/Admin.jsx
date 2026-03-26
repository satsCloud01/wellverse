import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../api'
import { C } from '../tokens'
import Section from '../components/Section'
import Btn from '../components/Btn'
import Divider from '../components/Divider'

export default function Admin() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [tab, setTab] = useState('applications')
  const [dashboard, setDashboard] = useState(null)
  const [applications, setApplications] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/signin'); return }
    if (user.role !== 'admin') { navigate('/'); return }
    Promise.all([
      api.getAdminDashboard().catch(() => null),
      api.getAdminApplications('pending').catch(() => []),
      api.getAdminUsers().catch(() => []),
    ]).then(([d, a, u]) => {
      setDashboard(d)
      setApplications(a)
      setUsers(u)
    }).finally(() => setLoading(false))
  }, [user, authLoading, navigate])

  const handleReview = async (id, status) => {
    setActionLoading(id)
    try {
      await api.reviewApplication(id, { status })
      setApplications((prev) => prev.filter((a) => a.id !== id))
    } catch { /* silent */ }
    finally { setActionLoading(null) }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.void }}>
        <p className="text-mist text-sm">Loading...</p>
      </div>
    )
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div style={{ background: C.void }}>
      <Section bg={C.void}>
        <div className="mb-9">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3">✦  Admin Panel</p>
          <h1 className="font-display font-normal text-parchment" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>Platform Overview</h1>
        </div>

        {/* Stats */}
        {dashboard && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              [dashboard.total_users, 'Total Users'],
              [dashboard.total_guides, 'Active Guides'],
              [dashboard.total_bookings, 'Total Bookings'],
              [dashboard.pending_applications, 'Pending Apps'],
            ].map(([val, label]) => (
              <div key={label} className="rounded-[16px] p-5 text-center" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}>
                <p className="font-display text-[28px] font-semibold text-gold">{val ?? 0}</p>
                <p className="text-xs text-mist mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 rounded-[10px] p-1 inline-flex" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
          {['applications', 'users', 'analytics'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer capitalize"
              style={{
                background: tab === t ? 'rgba(200,146,58,.15)' : 'transparent',
                color: tab === t ? C.gold : C.mist,
                border: 'none',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Applications Tab */}
        {tab === 'applications' && (
          <div className="rounded-[20px] p-7" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}>
            <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-4">Pending Applications</p>
            <Divider />
            <div className="mt-4">
              {applications.length === 0 ? (
                <p className="text-mist text-sm py-6 text-center">No pending applications.</p>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="py-4 border-b border-white/5 last:border-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-parchment font-medium">{app.full_name}</p>
                        <p className="text-xs text-mist mt-0.5">{app.email}</p>
                        <p className="text-[13px] text-dust mt-2">{app.vertical_id} &middot; {app.specialty || 'General'}</p>
                        {app.bio && <p className="text-xs text-mist mt-1 line-clamp-2">{app.bio}</p>}
                        {app.credentials && <p className="text-xs text-pine mt-1">Credentials: {app.credentials}</p>}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Btn v="teal" onClick={() => handleReview(app.id, 'approved')} className="!text-xs !px-4 !py-2">
                          {actionLoading === app.id ? '...' : 'Approve'}
                        </Btn>
                        <Btn v="ghost" onClick={() => handleReview(app.id, 'declined')} className="!text-xs !px-4 !py-2">
                          Decline
                        </Btn>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="rounded-[20px] p-7" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}>
            <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-4">All Users</p>
            <Divider />
            <div className="mt-4">
              {users.length === 0 ? (
                <p className="text-mist text-sm py-6 text-center">No users found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-[11px] text-mist uppercase tracking-wider pb-3 font-medium">Name</th>
                        <th className="text-[11px] text-mist uppercase tracking-wider pb-3 font-medium">Email</th>
                        <th className="text-[11px] text-mist uppercase tracking-wider pb-3 font-medium">Role</th>
                        <th className="text-[11px] text-mist uppercase tracking-wider pb-3 font-medium">Tier</th>
                        <th className="text-[11px] text-mist uppercase tracking-wider pb-3 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-white/5">
                          <td className="py-3 text-sm text-parchment">{u.full_name || '—'}</td>
                          <td className="py-3 text-sm text-dust">{u.email}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize" style={{
                              background: u.role === 'admin' ? 'rgba(200,146,58,.15)' : u.role === 'guide' ? 'rgba(42,106,96,.15)' : 'rgba(255,255,255,.06)',
                              color: u.role === 'admin' ? C.amber : u.role === 'guide' ? C.pine : C.mist,
                            }}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-mist capitalize">{u.tier || 'free'}</td>
                          <td className="py-3 text-xs text-mist">{u.created_at?.split('T')[0] || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <div className="rounded-[20px] p-7" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}>
            <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-4">Guide Analytics</p>
            <Divider />
            <div className="mt-4">
              {dashboard?.top_guides && dashboard.top_guides.length > 0 ? (
                dashboard.top_guides.map((g) => (
                  <div key={g.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{g.emoji || '🧭'}</span>
                      <div>
                        <p className="text-sm text-parchment font-medium">{g.name}</p>
                        <p className="text-xs text-mist">{g.vertical_id}</p>
                      </div>
                    </div>
                    <div className="flex gap-5 text-right">
                      <div>
                        <p className="text-sm text-gold font-semibold">{g.total_bookings || 0}</p>
                        <p className="text-[10px] text-mist">Bookings</p>
                      </div>
                      <div>
                        <p className="text-sm text-pine font-semibold">{g.avg_rating || '—'}</p>
                        <p className="text-[10px] text-mist">Rating</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-mist text-sm py-6 text-center">No analytics data available yet.</p>
              )}
            </div>
          </div>
        )}
      </Section>
    </div>
  )
}
