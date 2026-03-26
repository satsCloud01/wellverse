import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../api'
import { C, TIERS } from '../tokens'
import Section from '../components/Section'
import Btn from '../components/Btn'
import Divider from '../components/Divider'

export default function Settings() {
  const navigate = useNavigate()
  const { user, loading: authLoading, logout } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/signin'); return }
    api.getPaymentHistory().then(setPayments).catch(() => setPayments([])).finally(() => setLoading(false))
  }, [user, authLoading, navigate])

  const handleUpgrade = async () => {
    setUpgrading(true)
    try {
      const res = await api.createCheckout({ tier: 'committed' })
      if (res.url) window.location.href = res.url
    } catch { /* silent */ }
    finally { setUpgrading(false) }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.void }}>
        <p className="text-mist text-sm">Loading...</p>
      </div>
    )
  }

  if (!user) return null

  const currentTier = TIERS.find((t) => t.id === user.tier) || TIERS[0]

  return (
    <div data-tour="settings" style={{ background: C.void }}>
      <Section bg={C.void}>
        <div className="mb-9">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3">✦  Settings</p>
          <h1 className="font-display font-normal text-parchment" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>Your Account</h1>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Profile */}
          <div className="rounded-[20px] p-7" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}>
            <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-4">Profile</p>
            <Divider />
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-[11px] text-mist uppercase tracking-wider mb-1">Name</p>
                <p className="text-sm text-parchment">{user.full_name || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] text-mist uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm text-parchment">{user.email}</p>
              </div>
              <div>
                <p className="text-[11px] text-mist uppercase tracking-wider mb-1">Role</p>
                <p className="text-sm text-parchment capitalize">{user.role || 'member'}</p>
              </div>
              <div>
                <p className="text-[11px] text-mist uppercase tracking-wider mb-1">Member Since</p>
                <p className="text-sm text-parchment">{user.created_at?.split('T')[0] || '—'}</p>
              </div>
            </div>
            <div className="mt-6">
              <Btn v="ghost" onClick={() => { logout(); navigate('/') }} className="!text-xs">Sign Out</Btn>
            </div>
          </div>

          {/* Subscription */}
          <div className="rounded-[20px] p-7" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}>
            <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-4">Subscription</p>
            <Divider />
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display text-[22px] font-semibold text-gold">{currentTier.name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal/20 border border-teal/40 text-pine">{currentTier.price}</span>
              </div>
              <div className="mb-5">
                {currentTier.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <span className="text-sage text-[12px] mt-0.5 shrink-0">✓</span>
                    <span className="text-[13px] text-dust leading-relaxed">{perk}</span>
                  </div>
                ))}
              </div>
              {user.tier !== 'pro' && (
                <Btn v="gold" onClick={handleUpgrade} className="w-full">
                  {upgrading ? 'Redirecting...' : 'Upgrade to Committed — $49/mo'}
                </Btn>
              )}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="mt-6 rounded-[20px] p-7" style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.08)' }}>
          <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-4">Payment History</p>
          <Divider />
          <div className="mt-4">
            {payments.length === 0 ? (
              <p className="text-mist text-sm py-4 text-center">No payment history.</p>
            ) : (
              <div className="space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm text-parchment">{p.description || p.tier}</p>
                      <p className="text-xs text-mist">{p.created_at?.split('T')[0] || ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gold font-semibold">${(p.amount / 100).toFixed(2)}</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{
                        background: p.status === 'succeeded' ? 'rgba(42,106,96,.2)' : 'rgba(200,146,58,.15)',
                        color: p.status === 'succeeded' ? C.pine : C.amber,
                      }}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  )
}
