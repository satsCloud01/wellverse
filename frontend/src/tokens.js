export const C = {
  void: '#0A0A08',
  ink: '#111410',
  ember: '#1A1A14',
  parchment: '#F2EDE4',
  dust: '#C4BAA8',
  amber: '#C8923A',
  gold: '#E2B96F',
  moss: '#3A5A40',
  sage: '#6A9E72',
  sky: '#4A7A9A',
  skylt: '#6AAAC8',
  mist: '#8A9E96',
  wine: '#6A2A40',
  rose: '#B46278',
  teal: '#2A6A60',
  pine: '#3A9A78',
  olive: '#5A7A2A',
  oliveAcc: '#8AAA5A',
  plum: '#5A3A6A',
  plmAcc: '#9A7AB8',
  coral: '#7A3A2A',
  corAcc: '#C87A5A',
  indigo: '#2A3A7A',
  indAcc: '#6A7AC8',
}

export const WORDS = ['Mind', 'Body', 'Soul', 'Energy', 'Clarity', 'Purpose', 'Connection', 'Strength', 'Joy', 'Balance', 'Nourishment', 'Beauty', 'Love', 'Belonging', 'Creativity']

export const TIERS = [
  {
    id: 'free', name: 'Explorer', price: 'Free forever', badge: null,
    perks: ['Browse all guide profiles & reviews', 'Access the WellVerse Library', 'Join 1 free community circle', 'Book 1 free 30-min intro call'],
    note: 'No card required. Ever.',
  },
  {
    id: 'sessions', name: 'Seeker', price: 'Pay per session', badge: 'MOST POPULAR',
    perks: ['Everything in Explorer', "Book sessions at guide's rate ($40–$200)", 'Session notes & progress tracking', 'Direct messaging with guides', 'Calendar sync & reminders'],
    note: 'You pay only when you book.',
  },
  {
    id: 'pro', name: 'Committed', price: '$49 / month', badge: null,
    perks: ['Everything in Seeker', 'Unlimited community circles', 'Priority booking', '10% off all sessions', 'Monthly progress report', 'Curated guide matching'],
    note: 'Pause or cancel anytime.',
  },
]

export const GUIDE_REASONS = [
  { icon: '🔍', title: 'Qualified Discovery', desc: 'WellVerse shows you only to people actively seeking what you offer. Better-fit clients, fewer no-shows.' },
  { icon: '💳', title: 'Everything Built In', desc: 'No Calendly, no Stripe setup, no separate notes app. Scheduling, payments, and client notes — one platform.' },
  { icon: '🤝', title: 'A Community of Peers', desc: 'Monthly guide roundtables, peer supervision circles, and CPD resources. You grow alongside serious practitioners.' },
  { icon: '📈', title: 'Practice Analytics', desc: 'See which profile sections convert, where clients drop off, and what your repeat booking rate is.' },
  { icon: '🛡️', title: 'Trust You Can Point To', desc: 'The WellVerse Verified badge. Clients come pre-informed — fewer cold-start conversations.' },
  { icon: '💰', title: 'You Keep 85%', desc: 'We take 15%. First 90 days: zero commission. No monthly fee for established guides.' },
]

export const VET_STEPS = [
  { n: '01', title: 'Application & Credentials', desc: 'Guides submit qualifications and professional history. We verify with issuing bodies directly.', icon: '📋' },
  { n: '02', title: 'Practice Interview', desc: '30-min video call with our Guide Quality team — approach, ethics, and values alignment.', icon: '🎥' },
  { n: '03', title: '3 Supervised Sessions', desc: 'New guides complete 3 sessions with vetted clients. Feedback reviewed before full approval.', icon: '👁️' },
  { n: '04', title: 'Ongoing Review', desc: 'Guides rated below 4.5★ trigger a review. Consistent complaints result in removal.', icon: '⭐' },
]
