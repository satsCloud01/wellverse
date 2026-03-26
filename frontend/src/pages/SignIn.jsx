import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { C } from '../tokens'
import Btn from '../components/Btn'

export default function SignIn() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(email, password)
      } else {
        await register(email, password, fullName)
      }
      navigate('/')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-4 py-3 rounded-[10px] text-[15px] bg-white/[.04] border border-white/10 text-parchment font-body placeholder:text-mist outline-none focus:border-amber/40 transition-colors'

  return (
    <div className="min-h-screen flex items-center justify-center px-[6%]" style={{ background: C.void }}>
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-3">✦  WellVerse</p>
          <h1 className="font-display font-normal text-parchment" style={{ fontSize: 'clamp(28px,4vw,42px)' }}>
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-mist mt-2">
            {tab === 'login' ? 'Sign in to continue your journey.' : 'Start your self-investment journey.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 rounded-[10px] p-1" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className="flex-1 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all"
              style={{
                background: tab === t ? 'rgba(200,146,58,.15)' : 'transparent',
                color: tab === t ? C.gold : C.mist,
                border: 'none',
              }}
            >
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-[10px]" style={{ background: 'rgba(106,42,64,.15)', border: '1px solid rgba(106,42,64,.35)' }}>
            <p className="text-[13px] text-rose">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'register' && (
            <div>
              <label className="block text-[11px] font-bold tracking-[2px] text-mist uppercase mb-2">Full Name</label>
              <input className={inputCls} placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="block text-[11px] font-bold tracking-[2px] text-mist uppercase mb-2">Email</label>
            <input className={inputCls} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-[2px] text-mist uppercase mb-2">Password</label>
            <input className={inputCls} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Btn v="gold" className="w-full !mt-2" onClick={handleSubmit}>
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </Btn>
        </form>

        <p className="text-center text-[13px] text-mist mt-6">
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span className="text-gold cursor-pointer" onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError('') }}>
            {tab === 'login' ? 'Register' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  )
}
