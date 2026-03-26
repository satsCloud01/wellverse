import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// We need to mock fetch before importing api
const mockFetch = vi.fn()
global.fetch = mockFetch

// Reset modules so api.js picks up our mock
let api
beforeEach(async () => {
  vi.resetModules()
  global.fetch = mockFetch
  const mod = await import('../api.js')
  api = mod.api
  localStorage.clear()
  mockFetch.mockReset()
})

afterEach(() => {
  localStorage.clear()
})

function okResponse(data = {}) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  })
}

function errorResponse(status = 400, detail = 'Bad request') {
  return Promise.resolve({
    ok: false,
    status,
    statusText: 'Bad Request',
    json: () => Promise.resolve({ detail }),
  })
}

describe('API module exports', () => {
  it('exports an api object', () => {
    expect(api).toBeDefined()
    expect(typeof api).toBe('object')
  })

  const expectedFunctions = [
    'register', 'login', 'getMe',
    'getVerticals', 'getVertical',
    'getGuides', 'getGuide',
    'getGuideReviews', 'createReview',
    'createBooking', 'getBookings', 'getAvailability', 'updateBookingStatus',
    'joinWaitlist', 'submitApplication', 'getStats',
    'getConversations', 'sendMessage', 'getMessages',
    'createNote', 'getNotes',
    'createProgress', 'getProgress', 'getProgressReport',
    'getLibrary', 'getLibraryItem',
    'getCircles', 'joinCircle', 'leaveCircle',
    'createCheckout', 'getPaymentHistory',
    'getBlogPosts', 'getBlogPost',
    'getAdminDashboard', 'getAdminApplications', 'reviewApplication',
    'getAdminUsers', 'getGuideAnalytics', 'createLibraryItem',
    'createCircle', 'createBlogPost',
  ]

  it(`exports all ${expectedFunctions.length} API functions`, () => {
    expectedFunctions.forEach((fn) => {
      expect(typeof api[fn]).toBe('function')
    })
  })
})

describe('Request headers', () => {
  it('includes Content-Type application/json', async () => {
    mockFetch.mockReturnValue(okResponse([]))
    await api.getVerticals()
    const [, opts] = mockFetch.mock.calls[0]
    expect(opts.headers['Content-Type']).toBe('application/json')
  })

  it('does not include Authorization when no token', async () => {
    mockFetch.mockReturnValue(okResponse([]))
    await api.getVerticals()
    const [, opts] = mockFetch.mock.calls[0]
    expect(opts.headers['Authorization']).toBeUndefined()
  })

  it('includes Authorization Bearer token when set', async () => {
    localStorage.setItem('wellverse_token', 'test-jwt-123')
    mockFetch.mockReturnValue(okResponse([]))
    await api.getVerticals()
    const [, opts] = mockFetch.mock.calls[0]
    expect(opts.headers['Authorization']).toBe('Bearer test-jwt-123')
  })
})

describe('URL construction', () => {
  it('getVertical builds correct URL with ID', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    await api.getVertical('mind')
    expect(mockFetch.mock.calls[0][0]).toBe('/api/verticals/mind')
  })

  it('getGuide builds correct URL with ID', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    await api.getGuide(42)
    expect(mockFetch.mock.calls[0][0]).toBe('/api/guides/42')
  })

  it('getGuideReviews builds correct URL', async () => {
    mockFetch.mockReturnValue(okResponse([]))
    await api.getGuideReviews(7)
    expect(mockFetch.mock.calls[0][0]).toBe('/api/guides/7/reviews')
  })

  it('getAvailability builds correct URL', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    await api.getAvailability(5)
    expect(mockFetch.mock.calls[0][0]).toBe('/api/bookings/guide/5/availability')
  })

  it('getMessages builds correct URL', async () => {
    mockFetch.mockReturnValue(okResponse([]))
    await api.getMessages(3)
    expect(mockFetch.mock.calls[0][0]).toBe('/api/messages/conversation/3')
  })

  it('getGuides passes search params', async () => {
    mockFetch.mockReturnValue(okResponse([]))
    await api.getGuides({ vertical_id: 'mind', search: 'yoga' })
    const url = mockFetch.mock.calls[0][0]
    expect(url).toContain('vertical_id=mind')
    expect(url).toContain('search=yoga')
  })

  it('getGuides passes preview param', async () => {
    mockFetch.mockReturnValue(okResponse([]))
    await api.getGuides({ preview: false })
    const url = mockFetch.mock.calls[0][0]
    expect(url).toContain('preview=false')
  })

  it('getLibrary passes search and filter params', async () => {
    mockFetch.mockReturnValue(okResponse([]))
    await api.getLibrary({ vertical_id: 'body', content_type: 'article', search: 'meditation' })
    const url = mockFetch.mock.calls[0][0]
    expect(url).toContain('vertical_id=body')
    expect(url).toContain('content_type=article')
    expect(url).toContain('search=meditation')
  })

  it('getCircles passes vertical_id param', async () => {
    mockFetch.mockReturnValue(okResponse([]))
    await api.getCircles({ vertical_id: 'mind' })
    const url = mockFetch.mock.calls[0][0]
    expect(url).toContain('vertical_id=mind')
  })

  it('getAdminApplications appends status query', async () => {
    mockFetch.mockReturnValue(okResponse([]))
    await api.getAdminApplications('pending')
    expect(mockFetch.mock.calls[0][0]).toBe('/api/admin/applications?status=pending')
  })

  it('getAdminApplications works without status', async () => {
    mockFetch.mockReturnValue(okResponse([]))
    await api.getAdminApplications()
    expect(mockFetch.mock.calls[0][0]).toBe('/api/admin/applications')
  })

  it('updateBookingStatus builds correct URL with status query', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    await api.updateBookingStatus(10, 'confirmed')
    expect(mockFetch.mock.calls[0][0]).toBe('/api/bookings/10/status?status=confirmed')
  })

  it('getBlogPost passes slug', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    await api.getBlogPost('my-post')
    expect(mockFetch.mock.calls[0][0]).toBe('/api/blog/my-post')
  })

  it('getGuideAnalytics passes ID', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    await api.getGuideAnalytics(99)
    expect(mockFetch.mock.calls[0][0]).toBe('/api/admin/guide-analytics/99')
  })
})

describe('HTTP methods', () => {
  it('register sends POST', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    await api.register({ email: 'a@b.com', password: '123' })
    expect(mockFetch.mock.calls[0][1].method).toBe('POST')
  })

  it('login sends POST', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    await api.login({ email: 'a@b.com', password: '123' })
    expect(mockFetch.mock.calls[0][1].method).toBe('POST')
  })

  it('createBooking sends POST', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    await api.createBooking({ guide_id: 1 })
    expect(mockFetch.mock.calls[0][1].method).toBe('POST')
  })

  it('updateBookingStatus sends PATCH', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    await api.updateBookingStatus(1, 'confirmed')
    expect(mockFetch.mock.calls[0][1].method).toBe('PATCH')
  })

  it('leaveCircle sends DELETE', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    await api.leaveCircle(1)
    expect(mockFetch.mock.calls[0][1].method).toBe('DELETE')
  })

  it('getMe uses GET (no method specified)', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    await api.getMe()
    expect(mockFetch.mock.calls[0][1].method).toBeUndefined()
  })
})

describe('Error handling', () => {
  it('throws on non-ok response with detail', async () => {
    mockFetch.mockReturnValue(errorResponse(401, 'Unauthorized'))
    await expect(api.getMe()).rejects.toThrow('Unauthorized')
  })

  it('throws with status text when no detail', async () => {
    mockFetch.mockReturnValue(
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('no json')),
      })
    )
    await expect(api.getMe()).rejects.toThrow('500 Internal Server Error')
  })

  it('returns parsed JSON on success', async () => {
    const data = { id: 1, name: 'Test' }
    mockFetch.mockReturnValue(okResponse(data))
    const result = await api.getVertical(1)
    expect(result).toEqual(data)
  })
})

describe('Request body serialization', () => {
  it('serializes POST body as JSON', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    const data = { email: 'a@b.com', password: 'pass' }
    await api.register(data)
    const body = mockFetch.mock.calls[0][1].body
    expect(JSON.parse(body)).toEqual(data)
  })

  it('createReview sends guideId in URL and data in body', async () => {
    mockFetch.mockReturnValue(okResponse({}))
    const reviewData = { rating: 5, text: 'Great' }
    await api.createReview(42, reviewData)
    expect(mockFetch.mock.calls[0][0]).toBe('/api/guides/42/reviews')
    expect(JSON.parse(mockFetch.mock.calls[0][1].body)).toEqual(reviewData)
  })
})
