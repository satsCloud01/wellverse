import { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import { api } from '../api'
import Tag from './Tag'
import { VerBadge } from './Badges'
import Divider from './Divider'
import Btn from './Btn'

export default function GuideModal({ guide, onClose }) {
  if (!guide) return null
  const g = guide

  const { user } = useAuth()
  const [tab, setTab] = useState('profile') // profile | book | reviews | message
  const [reviews, setReviews] = useState([])
  const [bookDate, setBookDate] = useState('')
  const [bookTime, setBookTime] = useState('')
  const [bookType, setBookType] = useState('intro')
  const [bookStatus, setBookStatus] = useState(null)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewStatus, setReviewStatus] = useState(null)
  const [msgText, setMsgText] = useState('')
  const [messages, setMessages] = useState([])
  const [msgStatus, setMsgStatus] = useState(null)

  useEffect(() => {
    if (tab === 'reviews') api.getGuideReviews(g.id).then(setReviews).catch(() => {})
    if (tab === 'message' && user) api.getMessages(g.id).then(setMessages).catch(() => {})
  }, [tab, g.id])

  const handleBook = async () => {
    if (!bookDate || !bookTime) return
    try {
      await api.createBooking({
        guide_id: g.id,
        seeker_name: user?.full_name || 'Guest',
        seeker_email: user?.email || '',
        booking_type: bookType,
        date_time: `${bookDate}T${bookTime}`,
      })
      setBookStatus('success')
    } catch (e) {
      setBookStatus(e.message)
    }
  }

  const handleReview = async () => {
    if (!reviewForm.comment) return
    try {
      await api.createReview(g.id, {
        author: user?.full_name || 'Anonymous',
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      })
      setReviewStatus('success')
      setReviewForm({ rating: 5, comment: '' })
      api.getGuideReviews(g.id).then(setReviews).catch(() => {})
    } catch (e) {
      setReviewStatus(e.message)
    }
  }

  const handleSendMsg = async () => {
    if (!msgText.trim()) return
    try {
      await api.sendMessage({ guide_id: g.id, content: msgText })
      setMsgText('')
      setMsgStatus(null)
      api.getMessages(g.id).then(setMessages).catch(() => {})
    } catch (e) {
      setMsgStatus(e.message)
    }
  }

  const tabs = [
    ['profile', 'Profile'],
    ['book', 'Book'],
    ['reviews', `Reviews (${g.review_count})`],
    ['message', 'Message'],
  ]

  return (
    <div onClick={onClose} className="fixed inset-0 z-[900] flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,.82)', backdropFilter: 'blur(10px)' }}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[620px] max-h-[90vh] overflow-y-auto rounded-[20px]" style={{ background: '#111410', border: '1px solid rgba(255,255,255,.1)' }}>
        {/* Header */}
        <div className="px-7 pt-7 pb-5" style={{ background: `${g.color}18`, borderBottom: `1px solid ${g.color}25` }}>
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-start">
              <div className="w-[58px] h-[58px] rounded-[14px] flex items-center justify-center text-[26px]" style={{ background: `${g.color}28` }}>
                {g.emoji}
              </div>
              <div>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <Tag color={g.color}>Founding Guide</Tag>
                  <VerBadge />
                </div>
                <h2 className="font-display text-[25px] font-semibold text-parchment">{g.name}</h2>
                <p className="text-[13px] text-mist">{g.role} · {g.location}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/[.08] border-none text-dust text-lg cursor-pointer flex items-center justify-center">×</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 px-7 pt-4 pb-0">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-[13px] font-medium border-none cursor-pointer rounded-t-lg transition-all ${tab === key ? 'bg-white/[.06] text-parchment' : 'bg-transparent text-mist'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-7">
          {/* PROFILE TAB */}
          {tab === 'profile' && (
            <>
              <p className="font-display text-lg italic text-dust leading-[1.7] mb-4">"{g.quote}"</p>
              <p className="text-sm text-mist leading-[1.8] mb-5">{g.bio}</p>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  [`★ ${g.rating}`, 'Rating'],
                  [`${g.review_count} reviews`, 'Feedback'],
                  [g.price, 'Per Session'],
                ].map(([val, label]) => (
                  <div key={label} className="bg-white/[.04] rounded-[10px] p-3.5 text-center">
                    <div className="font-display text-lg font-semibold text-gold">{val}</div>
                    <div className="text-[11px] text-mist mt-1">{label}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl mb-5" style={{ background: 'rgba(42,106,96,.1)', border: '1px solid rgba(42,106,96,.28)' }}>
                <span className="text-[22px]">🎁</span>
                <div>
                  <p className="text-[13px] font-semibold text-pine">Free 30-min Intro Call</p>
                  <p className="text-xs text-mist mt-0.5">No commitment, just a conversation. Meet {g.name.split(' ')[0]} and see if it's the right fit.</p>
                </div>
              </div>
              <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-3">Methods & Specialties</p>
              <div className="flex gap-2 flex-wrap mb-5">
                {g.methods?.map((m) => (
                  <span key={m} className="px-3.5 py-1.5 rounded-full text-xs text-dust" style={{ background: `${g.color}12`, border: `1px solid ${g.color}28` }}>{m}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Btn v="teal" className="w-full text-[15px]" onClick={() => setTab('book')}>Book Free Intro Call</Btn>
                <Btn v="ghost" className="w-full text-[15px]" onClick={() => user ? setTab('message') : window.location.href = '/signin'}>Send a Message</Btn>
              </div>
            </>
          )}

          {/* BOOK TAB */}
          {tab === 'book' && (
            <>
              {bookStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="text-[48px] mb-4">✓</div>
                  <h3 className="font-display text-2xl text-parchment mb-2">Booked!</h3>
                  <p className="text-sm text-mist">Your {bookType === 'intro' ? 'free intro call' : 'session'} with {g.name} is confirmed. Check your email for details.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl text-parchment mb-4">Book with {g.name}</h3>
                  <div className="flex gap-3 mb-5">
                    {[['intro', 'Free Intro (30 min)'], ['session', `Session (${g.price})`]].map(([type, label]) => (
                      <button
                        key={type}
                        onClick={() => setBookType(type)}
                        className={`flex-1 py-3 rounded-xl text-[13px] font-medium border cursor-pointer transition-all ${bookType === type ? 'bg-teal/20 border-teal/40 text-pine' : 'bg-transparent border-white/10 text-mist'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 mb-5">
                    <div>
                      <p className="text-[11px] font-semibold text-mist tracking-wider uppercase mb-2">Date</p>
                      <input type="date" value={bookDate} onChange={(e) => setBookDate(e.target.value)} className="w-full px-4 py-3 bg-white/[.05] border border-white/[.12] rounded-[10px] text-sm text-parchment font-body outline-none" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-mist tracking-wider uppercase mb-2">Time</p>
                      <input type="time" value={bookTime} onChange={(e) => setBookTime(e.target.value)} className="w-full px-4 py-3 bg-white/[.05] border border-white/[.12] rounded-[10px] text-sm text-parchment font-body outline-none" />
                    </div>
                  </div>
                  {typeof bookStatus === 'string' && bookStatus !== 'success' && (
                    <p className="text-rose text-sm mb-3">{bookStatus}</p>
                  )}
                  <Btn v="teal" className="w-full" onClick={handleBook}>
                    {bookType === 'intro' ? 'Book Free Intro Call' : 'Book & Pay'}
                  </Btn>
                  {!user && <p className="text-xs text-mist text-center mt-2">You can book without signing in, but signing in lets you track your sessions.</p>}
                </>
              )}
            </>
          )}

          {/* REVIEWS TAB */}
          {tab === 'reviews' && (
            <>
              <h3 className="font-display text-xl text-parchment mb-4">Reviews for {g.name}</h3>
              {reviews.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-white/[.03] border border-white/[.06] rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-parchment">{r.author}</span>
                        <span className="text-gold text-sm">{'★'.repeat(Math.round(r.rating))} {r.rating}</span>
                      </div>
                      <p className="text-[13px] text-dust leading-relaxed">{r.comment}</p>
                      <p className="text-[11px] text-mist mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-mist mb-6">No reviews yet. Be the first!</p>
              )}
              <Divider />
              <div className="mt-4">
                <p className="text-[11px] font-bold tracking-[2px] text-mist uppercase mb-3">Write a Review</p>
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })} className={`text-xl cursor-pointer border-none bg-transparent ${n <= reviewForm.rating ? 'text-gold' : 'text-white/20'}`}>
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 bg-white/[.05] border border-white/[.12] rounded-[10px] text-sm text-parchment font-body outline-none resize-none h-20 placeholder:text-mist mb-3"
                />
                {reviewStatus === 'success' && <p className="text-pine text-sm mb-2">Review submitted!</p>}
                {reviewStatus && reviewStatus !== 'success' && <p className="text-rose text-sm mb-2">{reviewStatus}</p>}
                <Btn v="gold" onClick={handleReview} className="w-full">Submit Review</Btn>
              </div>
            </>
          )}

          {/* MESSAGE TAB */}
          {tab === 'message' && (
            <>
              {!user ? (
                <div className="text-center py-8">
                  <p className="text-mist mb-4">Sign in to message {g.name}</p>
                  <Btn v="gold" onClick={() => window.location.href = '/signin'}>Sign In</Btn>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl text-parchment mb-4">Message {g.name}</h3>
                  <div className="bg-white/[.02] border border-white/[.06] rounded-xl p-4 mb-4 max-h-[300px] overflow-y-auto space-y-3">
                    {messages.length === 0 && <p className="text-sm text-mist text-center py-4">Start the conversation</p>}
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${m.sender_id === user.id ? 'bg-teal/20 text-parchment' : 'bg-white/[.06] text-dust'}`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={msgText}
                      onChange={(e) => setMsgText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMsg()}
                      placeholder={`Message ${g.name.split(' ')[0]}...`}
                      className="flex-1 px-4 py-3 bg-white/[.05] border border-white/[.12] rounded-[10px] text-sm text-parchment font-body outline-none placeholder:text-mist"
                    />
                    <Btn v="teal" onClick={handleSendMsg}>Send</Btn>
                  </div>
                  {msgStatus && <p className="text-rose text-xs mt-2">{msgStatus}</p>}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
