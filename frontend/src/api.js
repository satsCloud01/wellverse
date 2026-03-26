const BASE = '/api'

function getToken() {
  return localStorage.getItem('wellverse_token')
}

async function request(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `${res.status} ${res.statusText}`)
  }
  return res.json()
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),

  // Verticals
  getVerticals: () => request('/verticals'),
  getVertical: (id) => request(`/verticals/${id}`),

  // Guides
  getGuides: (params) => {
    const q = new URLSearchParams()
    if (params?.vertical_id) q.set('vertical_id', params.vertical_id)
    if (params?.search) q.set('search', params.search)
    if (params?.preview !== undefined) q.set('preview', params.preview)
    return request(`/guides?${q}`)
  },
  getGuide: (id) => request(`/guides/${id}`),

  // Reviews
  getGuideReviews: (id) => request(`/guides/${id}/reviews`),
  createReview: (guideId, data) => request(`/guides/${guideId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),

  // Bookings
  createBooking: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getBookings: () => request('/bookings'),
  getAvailability: (guideId) => request(`/bookings/guide/${guideId}/availability`),
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status?status=${status}`, { method: 'PATCH' }),

  // Waitlist
  joinWaitlist: (data) => request('/waitlist', { method: 'POST', body: JSON.stringify(data) }),

  // Applications
  submitApplication: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) }),

  // Stats
  getStats: () => request('/stats'),

  // Messaging
  getConversations: () => request('/messages/conversations'),
  sendMessage: (data) => request('/messages', { method: 'POST', body: JSON.stringify(data) }),
  getMessages: (guideId) => request(`/messages/conversation/${guideId}`),

  // Session Notes
  createNote: (data) => request('/notes', { method: 'POST', body: JSON.stringify(data) }),
  getNotes: () => request('/notes'),

  // Progress
  createProgress: (data) => request('/progress', { method: 'POST', body: JSON.stringify(data) }),
  getProgress: () => request('/progress'),
  getProgressReport: () => request('/progress/report'),

  // Library
  getLibrary: (params) => {
    const q = new URLSearchParams()
    if (params?.vertical_id) q.set('vertical_id', params.vertical_id)
    if (params?.content_type) q.set('content_type', params.content_type)
    if (params?.search) q.set('search', params.search)
    return request(`/library?${q}`)
  },
  getLibraryItem: (id) => request(`/library/${id}`),

  // Circles
  getCircles: (params) => {
    const q = new URLSearchParams()
    if (params?.vertical_id) q.set('vertical_id', params.vertical_id)
    return request(`/circles?${q}`)
  },
  joinCircle: (id) => request(`/circles/${id}/join`, { method: 'POST' }),
  leaveCircle: (id) => request(`/circles/${id}/leave`, { method: 'DELETE' }),

  // Payments
  createCheckout: (data) => request('/payments/create-checkout', { method: 'POST', body: JSON.stringify(data) }),
  getPaymentHistory: () => request('/payments/history'),

  // Blog
  getBlogPosts: () => request('/blog'),
  getBlogPost: (slug) => request(`/blog/${slug}`),

  // Admin
  getAdminDashboard: () => request('/admin/dashboard'),
  getAdminApplications: (status) => request(`/admin/applications${status ? `?status=${status}` : ''}`),
  reviewApplication: (id, data) => request(`/admin/applications/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminUsers: () => request('/admin/users'),
  getGuideAnalytics: (id) => request(`/admin/guide-analytics/${id}`),
  createLibraryItem: (data) => request('/admin/library', { method: 'POST', body: JSON.stringify(data) }),
  createCircle: (data) => request('/admin/circles', { method: 'POST', body: JSON.stringify(data) }),
  createBlogPost: (data) => request('/admin/blog', { method: 'POST', body: JSON.stringify(data) }),
}
