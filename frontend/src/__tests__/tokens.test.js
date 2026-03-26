import { describe, it, expect } from 'vitest'
import { C, WORDS, TIERS, GUIDE_REASONS, VET_STEPS } from '../tokens'

describe('Design tokens (C)', () => {
  it('exports all 24 color tokens', () => {
    expect(Object.keys(C)).toHaveLength(24)
  })

  it('has valid hex color values', () => {
    Object.values(C).forEach((val) => {
      expect(val).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })

  it('includes core brand colors', () => {
    expect(C.void).toBe('#0A0A08')
    expect(C.parchment).toBe('#F2EDE4')
    expect(C.amber).toBe('#C8923A')
    expect(C.gold).toBe('#E2B96F')
    expect(C.moss).toBe('#3A5A40')
    expect(C.teal).toBe('#2A6A60')
  })
})

describe('WORDS array', () => {
  it('has 15 rotating hero words', () => {
    expect(WORDS).toHaveLength(15)
  })

  it('starts with Mind and ends with Creativity', () => {
    expect(WORDS[0]).toBe('Mind')
    expect(WORDS[WORDS.length - 1]).toBe('Creativity')
  })

  it('includes the 6 core dimensions', () => {
    const core = ['Mind', 'Body', 'Energy', 'Connection', 'Strength', 'Joy']
    core.forEach((w) => expect(WORDS).toContain(w))
  })

  it('contains only non-empty strings', () => {
    WORDS.forEach((w) => {
      expect(typeof w).toBe('string')
      expect(w.length).toBeGreaterThan(0)
    })
  })
})

describe('TIERS', () => {
  it('has 3 pricing tiers', () => {
    expect(TIERS).toHaveLength(3)
  })

  it('has correct tier IDs in order', () => {
    expect(TIERS.map((t) => t.id)).toEqual(['free', 'sessions', 'pro'])
  })

  it('has correct tier names', () => {
    expect(TIERS.map((t) => t.name)).toEqual(['Explorer', 'Seeker', 'Committed'])
  })

  it('marks Seeker as MOST POPULAR', () => {
    const seeker = TIERS.find((t) => t.id === 'sessions')
    expect(seeker.badge).toBe('MOST POPULAR')
  })

  it('free and pro tiers have no badge', () => {
    expect(TIERS[0].badge).toBeNull()
    expect(TIERS[2].badge).toBeNull()
  })

  it('each tier has perks array with at least 3 items', () => {
    TIERS.forEach((t) => {
      expect(Array.isArray(t.perks)).toBe(true)
      expect(t.perks.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('each tier has a note string', () => {
    TIERS.forEach((t) => {
      expect(typeof t.note).toBe('string')
      expect(t.note.length).toBeGreaterThan(0)
    })
  })

  it('free tier price is Free forever', () => {
    expect(TIERS[0].price).toBe('Free forever')
  })

  it('pro tier price is $49 / month', () => {
    expect(TIERS[2].price).toBe('$49 / month')
  })
})

describe('GUIDE_REASONS', () => {
  it('has 6 reasons', () => {
    expect(GUIDE_REASONS).toHaveLength(6)
  })

  it('each reason has icon, title, and desc', () => {
    GUIDE_REASONS.forEach((r) => {
      expect(r).toHaveProperty('icon')
      expect(r).toHaveProperty('title')
      expect(r).toHaveProperty('desc')
      expect(r.title.length).toBeGreaterThan(0)
      expect(r.desc.length).toBeGreaterThan(0)
    })
  })

  it('includes key titles', () => {
    const titles = GUIDE_REASONS.map((r) => r.title)
    expect(titles).toContain('Qualified Discovery')
    expect(titles).toContain('Everything Built In')
    expect(titles).toContain('You Keep 85%')
    expect(titles).toContain('Practice Analytics')
  })
})

describe('VET_STEPS', () => {
  it('has 4 vetting steps', () => {
    expect(VET_STEPS).toHaveLength(4)
  })

  it('steps are numbered 01 through 04', () => {
    expect(VET_STEPS.map((s) => s.n)).toEqual(['01', '02', '03', '04'])
  })

  it('each step has n, title, desc, and icon', () => {
    VET_STEPS.forEach((s) => {
      expect(s).toHaveProperty('n')
      expect(s).toHaveProperty('title')
      expect(s).toHaveProperty('desc')
      expect(s).toHaveProperty('icon')
    })
  })

  it('includes key step titles', () => {
    const titles = VET_STEPS.map((s) => s.title)
    expect(titles).toContain('Application & Credentials')
    expect(titles).toContain('Practice Interview')
    expect(titles).toContain('3 Supervised Sessions')
    expect(titles).toContain('Ongoing Review')
  })
})
