import { useState } from 'react'
import { api } from '../api'

export default function WaitlistBox({ vertical }) {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const v = vertical

  const handleJoin = async () => {
    if (!email.includes('@')) return
    try {
      await api.joinWaitlist({ email, vertical_id: v.id })
      setDone(true)
    } catch {
      setDone(true)
    }
  }

  return (
    <div className="rounded-[14px] p-5" style={{ background: `${v.color}12`, border: `1px solid ${v.color}28` }}>
      {done ? (
        <div className="text-center py-2">
          <div className="text-[32px] mb-2.5">✓</div>
          <p className="font-display text-lg mb-1.5" style={{ color: v.accent }}>You're on the waitlist!</p>
          <p className="text-[13px] text-mist">We'll email you as soon as {v.label} launches.</p>
        </div>
      ) : (
        <div>
          <p className="font-display text-lg font-semibold mb-1.5" style={{ color: v.accent }}>Join the {v.label} waitlist</p>
          <p className="text-[13px] text-mist mb-3.5">Be first to access guides when this vertical launches.</p>
          <div className="flex gap-2.5">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-3.5 py-2.5 rounded-[10px] text-sm text-parchment bg-white/[.06] border border-white/[.14] outline-none font-body"
            />
            <button
              onClick={handleJoin}
              className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white border-none cursor-pointer"
              style={{ background: v.color }}
            >
              Join →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
