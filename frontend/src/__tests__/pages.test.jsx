import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock the api module globally
vi.mock('../api.js', () => ({
  api: {
    register: vi.fn(),
    login: vi.fn(),
    getMe: vi.fn(() => Promise.reject(new Error('no token'))),
    getVerticals: vi.fn(() => Promise.resolve([])),
    getVertical: vi.fn(() => Promise.resolve({})),
    getGuides: vi.fn(() => Promise.resolve([])),
    getGuide: vi.fn(() => Promise.resolve({})),
    getGuideReviews: vi.fn(() => Promise.resolve([])),
    createReview: vi.fn(),
    createBooking: vi.fn(),
    getBookings: vi.fn(() => Promise.resolve([])),
    getAvailability: vi.fn(() => Promise.resolve({})),
    updateBookingStatus: vi.fn(),
    joinWaitlist: vi.fn(),
    submitApplication: vi.fn(),
    getStats: vi.fn(() => Promise.resolve({ founding_members: 100, vetted_guides: 50, intro_sessions: 200, avg_rating: 4.8 })),
    getConversations: vi.fn(() => Promise.resolve([])),
    sendMessage: vi.fn(),
    getMessages: vi.fn(() => Promise.resolve([])),
    createNote: vi.fn(),
    getNotes: vi.fn(() => Promise.resolve([])),
    createProgress: vi.fn(),
    getProgress: vi.fn(() => Promise.resolve([])),
    getProgressReport: vi.fn(() => Promise.resolve({})),
    getLibrary: vi.fn(() => Promise.resolve([])),
    getLibraryItem: vi.fn(() => Promise.resolve({})),
    getCircles: vi.fn(() => Promise.resolve([])),
    joinCircle: vi.fn(),
    leaveCircle: vi.fn(),
    createCheckout: vi.fn(),
    getPaymentHistory: vi.fn(() => Promise.resolve([])),
    getBlogPosts: vi.fn(() => Promise.resolve([])),
    getBlogPost: vi.fn(() => Promise.resolve({})),
    getAdminDashboard: vi.fn(() => Promise.resolve({})),
    getAdminApplications: vi.fn(() => Promise.resolve([])),
    reviewApplication: vi.fn(),
    getAdminUsers: vi.fn(() => Promise.resolve([])),
    getGuideAnalytics: vi.fn(() => Promise.resolve({})),
    createLibraryItem: vi.fn(),
    createCircle: vi.fn(),
    createBlogPost: vi.fn(),
  },
}))

// Mock AuthContext to avoid actual API calls
vi.mock('../AuthContext.jsx', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: null,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}))

import Home from '../pages/Home'
import Browse from '../pages/Browse'
import ForGuides from '../pages/ForGuides'
import Apply from '../pages/Apply'
import SignIn from '../pages/SignIn'
import Explore from '../pages/Explore'
import Privacy from '../pages/Privacy'
import Terms from '../pages/Terms'
import Blog from '../pages/Blog'
import Library from '../pages/Library'
import Circles from '../pages/Circles'
import Dashboard from '../pages/Dashboard'
import Messages from '../pages/Messages'
import Settings from '../pages/Settings'

function renderPage(Component, props = {}) {
  return render(
    <MemoryRouter>
      <Component {...props} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Home page', () => {
  it('renders without crashing', () => {
    renderPage(Home, { onOpenGuide: vi.fn() })
  })

  it('shows the hero tagline', () => {
    renderPage(Home, { onOpenGuide: vi.fn() })
    expect(screen.getByText(/Invest in your/)).toBeInTheDocument()
  })

  it('shows the WellVerse brand', () => {
    renderPage(Home, { onOpenGuide: vi.fn() })
    expect(screen.getAllByText(/WellVerse/).length).toBeGreaterThan(0)
  })

  it('shows Explore and Browse buttons', () => {
    renderPage(Home, { onOpenGuide: vi.fn() })
    expect(screen.getByText(/Explore All 6 Verticals/)).toBeInTheDocument()
    expect(screen.getByText(/Browse Live Guides/)).toBeInTheDocument()
  })

  it('shows pricing section with 3 tiers', () => {
    renderPage(Home, { onOpenGuide: vi.fn() })
    expect(screen.getByText('Explorer')).toBeInTheDocument()
    expect(screen.getByText('Seeker')).toBeInTheDocument()
    expect(screen.getByText('Committed')).toBeInTheDocument()
  })

  it('shows founding guides section', () => {
    renderPage(Home, { onOpenGuide: vi.fn() })
    expect(screen.getByText('Founding Guides')).toBeInTheDocument()
  })
})

describe('SignIn page', () => {
  it('renders without crashing', () => {
    renderPage(SignIn)
  })

  it('shows Sign In and Register tabs', () => {
    renderPage(SignIn)
    const signInButtons = screen.getAllByText('Sign In')
    expect(signInButtons.length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Register').length).toBeGreaterThanOrEqual(1)
  })

  it('shows Welcome back heading for login tab', () => {
    renderPage(SignIn)
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
  })

  it('shows email and password inputs', () => {
    renderPage(SignIn)
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('shows WellVerse branding', () => {
    renderPage(SignIn)
    expect(screen.getByText(/WellVerse/)).toBeInTheDocument()
  })

  it('shows sign in button', () => {
    renderPage(SignIn)
    // The submit Btn component
    expect(screen.getByText('Sign In', { selector: 'button.font-body' })).toBeInTheDocument()
  })
})

describe('Apply page', () => {
  it('renders without crashing', () => {
    renderPage(Apply)
  })

  it('shows Guide Application heading', () => {
    renderPage(Apply)
    expect(screen.getByText('Guide Application')).toBeInTheDocument()
  })

  it('shows 3-step form tabs', () => {
    renderPage(Apply)
    expect(screen.getByText('Your Details')).toBeInTheDocument()
    expect(screen.getByText('Your Practice')).toBeInTheDocument()
    expect(screen.getByText('Why WellVerse?')).toBeInTheDocument()
  })

  it('shows step 1 fields by default', () => {
    renderPage(Apply)
    expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
  })

  it('shows Next button on first step', () => {
    renderPage(Apply)
    expect(screen.getByText(/Next/)).toBeInTheDocument()
  })

  it('shows apply to join heading', () => {
    renderPage(Apply)
    expect(screen.getByText(/Apply to join/)).toBeInTheDocument()
  })
})

describe('ForGuides page', () => {
  it('renders without crashing', () => {
    renderPage(ForGuides)
  })

  it('shows hero heading', () => {
    renderPage(ForGuides)
    expect(screen.getByText(/You already have the skills/)).toBeInTheDocument()
  })

  it('shows all 6 guide reasons', () => {
    renderPage(ForGuides)
    expect(screen.getByText('Qualified Discovery')).toBeInTheDocument()
    expect(screen.getByText('Everything Built In')).toBeInTheDocument()
    expect(screen.getByText('A Community of Peers')).toBeInTheDocument()
    expect(screen.getByText('Practice Analytics')).toBeInTheDocument()
    expect(screen.getByText('Trust You Can Point To')).toBeInTheDocument()
    expect(screen.getByText('You Keep 85%')).toBeInTheDocument()
  })

  it('shows all 4 vet steps', () => {
    renderPage(ForGuides)
    expect(screen.getByText('Application & Credentials')).toBeInTheDocument()
    expect(screen.getByText('Practice Interview')).toBeInTheDocument()
    expect(screen.getByText('3 Supervised Sessions')).toBeInTheDocument()
    expect(screen.getByText('Ongoing Review')).toBeInTheDocument()
  })

  it('shows economics section with commission numbers', () => {
    renderPage(ForGuides)
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()
  })

  it('shows Apply to Be a Guide button', () => {
    renderPage(ForGuides)
    expect(screen.getByText(/Apply to Be a Guide/)).toBeInTheDocument()
  })

  it('shows verification section', () => {
    renderPage(ForGuides)
    expect(screen.getByText('Verification')).toBeInTheDocument()
    expect(screen.getByText(/30% of applicants are declined/)).toBeInTheDocument()
  })
})

describe('Browse page', () => {
  it('renders without crashing', () => {
    renderPage(Browse, { onOpenGuide: vi.fn() })
  })

  it('shows search input', () => {
    renderPage(Browse, { onOpenGuide: vi.fn() })
    expect(screen.getByPlaceholderText('Name, method, specialty...')).toBeInTheDocument()
  })

  it('shows All Guides filter button', () => {
    renderPage(Browse, { onOpenGuide: vi.fn() })
    expect(screen.getByText('All Guides')).toBeInTheDocument()
  })

  it('shows Find Your Guide label', () => {
    renderPage(Browse, { onOpenGuide: vi.fn() })
    expect(screen.getByText('Find Your Guide')).toBeInTheDocument()
  })

  it('shows personally vetted heading', () => {
    renderPage(Browse, { onOpenGuide: vi.fn() })
    expect(screen.getByText(/personally vetted/)).toBeInTheDocument()
  })

  it('shows coming soon banner', () => {
    renderPage(Browse, { onOpenGuide: vi.fn() })
    expect(screen.getByText(/Nutrition, Relationships, Beauty & Passion Circles coming soon/)).toBeInTheDocument()
  })

  it('shows free intro call banner', () => {
    renderPage(Browse, { onOpenGuide: vi.fn() })
    expect(screen.getByText(/Every guide offers a free 30-min intro call/)).toBeInTheDocument()
  })

  it('shows guide count', () => {
    renderPage(Browse, { onOpenGuide: vi.fn() })
    expect(screen.getByText(/0 live guides/)).toBeInTheDocument()
  })

  it('shows no guides found when empty', () => {
    renderPage(Browse, { onOpenGuide: vi.fn() })
    expect(screen.getByText('No guides found')).toBeInTheDocument()
  })
})

describe('Explore page', () => {
  it('renders without crashing', () => {
    renderPage(Explore)
  })
})

describe('Privacy page', () => {
  it('renders without crashing', () => {
    renderPage(Privacy)
  })
})

describe('Terms page', () => {
  it('renders without crashing', () => {
    renderPage(Terms)
  })
})

describe('Blog page', () => {
  it('renders without crashing', () => {
    renderPage(Blog)
  })
})

describe('Library page', () => {
  it('renders without crashing', () => {
    renderPage(Library)
  })
})

describe('Circles page', () => {
  it('renders without crashing', () => {
    renderPage(Circles)
  })
})

describe('Dashboard page', () => {
  it('renders without crashing', () => {
    renderPage(Dashboard)
  })
})

describe('Messages page', () => {
  it('renders without crashing', () => {
    renderPage(Messages)
  })
})

describe('Settings page', () => {
  it('renders without crashing', () => {
    renderPage(Settings)
  })
})
