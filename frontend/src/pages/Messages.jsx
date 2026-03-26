import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { api } from '../api'
import { C } from '../tokens'
import Btn from '../components/Btn'
import Divider from '../components/Divider'

export default function Messages() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeGuide, setActiveGuide] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/signin'); return }
    api.getConversations().then((c) => {
      setConversations(c)
      if (c.length > 0) setActiveGuide(c[0])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (!activeGuide) return
    api.getMessages(activeGuide.guide_id).then(setMessages).catch(() => setMessages([]))
  }, [activeGuide])

  const handleSend = async () => {
    if (!input.trim() || !activeGuide || sending) return
    setSending(true)
    try {
      const msg = await api.sendMessage({ guide_id: activeGuide.guide_id, content: input.trim() })
      setMessages((prev) => [...prev, msg])
      setInput('')
    } catch {
      // silent
    } finally {
      setSending(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.void }}>
        <p className="text-mist text-sm">Loading...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div data-tour="messages" className="min-h-screen flex" style={{ background: C.void }}>
      {/* Sidebar */}
      <div className="w-[320px] shrink-0 border-r border-white/[.06] flex flex-col" style={{ background: C.ink }}>
        <div className="p-5">
          <p className="text-[11px] font-bold tracking-[3px] text-amber uppercase mb-1">Messages</p>
          <p className="text-xs text-mist">{conversations.length} conversations</p>
        </div>
        <Divider />
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-5 text-center">
              <p className="text-sm text-mist mb-3">No conversations yet</p>
              <Btn v="ghost" onClick={() => navigate('/browse')}>Find a guide</Btn>
            </div>
          ) : (
            conversations.map((c) => {
              const active = activeGuide?.guide_id === c.guide_id
              return (
                <button
                  key={c.guide_id}
                  onClick={() => setActiveGuide(c)}
                  className="w-full text-left px-5 py-3.5 flex items-center gap-3 cursor-pointer border-none transition-colors"
                  style={{
                    background: active ? 'rgba(200,146,58,.08)' : 'transparent',
                    borderLeft: active ? `2px solid ${C.amber}` : '2px solid transparent',
                  }}
                >
                  <span className="text-xl">{c.guide_emoji || '🧭'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-parchment font-medium truncate">{c.guide_name}</p>
                    <p className="text-xs text-mist truncate">{c.last_message || 'Start a conversation'}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber text-white text-[10px] font-bold flex items-center justify-center shrink-0">{c.unread}</span>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {!activeGuide ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-mist text-sm">Select a conversation to begin</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[.06] flex items-center gap-3" style={{ background: C.ember }}>
              <span className="text-xl">{activeGuide.guide_emoji || '🧭'}</span>
              <div>
                <p className="text-sm text-parchment font-medium">{activeGuide.guide_name}</p>
                <p className="text-xs text-mist">{activeGuide.guide_role || 'Guide'}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3">
              {messages.length === 0 ? (
                <p className="text-center text-mist text-sm py-10">No messages yet. Say hello!</p>
              ) : (
                messages.map((m) => {
                  const isMe = m.sender_id === user.id
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className="max-w-[65%] px-4 py-3 rounded-[14px]"
                        style={{
                          background: isMe ? 'rgba(200,146,58,.15)' : 'rgba(255,255,255,.05)',
                          border: isMe ? '1px solid rgba(200,146,58,.25)' : '1px solid rgba(255,255,255,.08)',
                        }}
                      >
                        <p className="text-[14px] text-parchment leading-relaxed">{m.content}</p>
                        <p className="text-[10px] text-mist/60 mt-1.5 text-right">{m.created_at?.split('T')[1]?.slice(0, 5) || ''}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-white/[.06]" style={{ background: C.ember }}>
              <div className="flex items-center gap-3">
                <input
                  className="flex-1 px-4 py-3 rounded-[10px] text-[15px] bg-white/[.04] border border-white/10 text-parchment font-body placeholder:text-mist outline-none focus:border-amber/40"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Btn v="gold" onClick={handleSend}>{sending ? '...' : 'Send'}</Btn>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
