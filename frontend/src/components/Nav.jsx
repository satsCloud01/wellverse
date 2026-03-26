import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Btn from './Btn'

const publicLinks = [
  ['/browse', 'Find Guides'],
  ['/explore', 'All 6'],
  ['/for-guides', 'For Guides'],
]

const userLinks = [
  ['/browse', 'Guides'],
  ['/library', 'Library'],
  ['/circles', 'Circles'],
  ['/messages', 'Messages'],
]

export default function Nav({ onStartTour }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  const links = user ? userLinks : publicLinks

  return (
    <nav className="sticky top-0 z-[200] px-[6%]" style={{ background: 'rgba(10,10,8,.94)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
      <div className="max-w-[1240px] mx-auto h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate(user ? '/dashboard' : '/')}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#3A5A40,#C8923A)' }}>
            ✦
          </div>
          <span className="font-display text-[21px] font-semibold tracking-wide text-parchment">WellVerse</span>
        </div>

        <div className="flex gap-1 p-1 bg-white/[.04] rounded-[10px]">
          {links.map(([path, label]) => {
            const active = pathname === path || (path === '/explore' && pathname.startsWith('/vertical/'))
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`px-3.5 py-[7px] rounded-lg text-[13px] font-medium border-none cursor-pointer transition-all ${active ? 'bg-amber/20 text-gold' : 'bg-transparent text-mist'}`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="flex gap-2 items-center">
          {user ? (
            <>
              {user.role === 'admin' && (
                <button onClick={() => navigate('/admin')} className="px-3 py-1.5 rounded-lg text-[12px] bg-wine/20 border border-wine/30 text-rose cursor-pointer">
                  Admin
                </button>
              )}
              <button
                onClick={onStartTour}
                className="px-3 py-2 rounded-lg text-[12px] cursor-pointer transition-all hover:text-gold border-none bg-transparent"
                style={{ color: '#8A9E96' }}
              >
                Tour
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="px-3.5 py-2 rounded-lg text-[13px] bg-transparent border border-parchment/[.18] text-parchment cursor-pointer font-medium"
              >
                {user.full_name.split(' ')[0]}
              </button>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="px-3 py-2 rounded-lg text-[12px] bg-transparent text-mist cursor-pointer border-none hover:text-parchment transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onStartTour}
                className="px-3 py-2 rounded-lg text-[12px] cursor-pointer transition-all hover:text-gold border-none bg-transparent"
                style={{ color: '#8A9E96' }}
              >
                Tour
              </button>
              <button
                data-tour="signin-btn"
                onClick={() => navigate('/signin')}
                className="px-3.5 py-2 rounded-lg text-[13px] bg-transparent border border-parchment/[.18] text-parchment cursor-pointer font-medium"
              >
                Sign In
              </button>
              <Btn v="gold" onClick={() => navigate('/browse')} className="!px-4 !py-2 !text-[13px]">
                Start Free →
              </Btn>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
