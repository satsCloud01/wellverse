import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Btn from '../components/Btn'
import Tag from '../components/Tag'
import { VerBadge, EarlyBadge, StatusPill } from '../components/Badges'
import Divider from '../components/Divider'
import Section from '../components/Section'
import GuideCard from '../components/GuideCard'
import WaitlistBox from '../components/WaitlistBox'

function wrap(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('Btn', () => {
  it('renders with children text', () => {
    wrap(<Btn>Click me</Btn>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders as a button element', () => {
    wrap(<Btn>Test</Btn>)
    expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument()
  })

  it('renders with gold variant by default', () => {
    wrap(<Btn>Gold</Btn>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-amber')
  })

  it('renders with ghost variant', () => {
    wrap(<Btn v="ghost">Ghost</Btn>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-transparent')
  })

  it('renders with teal variant', () => {
    wrap(<Btn v="teal">Teal</Btn>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-teal')
  })

  it('renders with moss variant', () => {
    wrap(<Btn v="moss">Moss</Btn>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-moss')
  })

  it('renders with outline variant', () => {
    wrap(<Btn v="outline">Outline</Btn>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-transparent')
  })

  it('applies custom className', () => {
    wrap(<Btn className="w-full">Wide</Btn>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('w-full')
  })
})

describe('Tag', () => {
  it('renders children text', () => {
    wrap(<Tag>Founding Guide</Tag>)
    expect(screen.getByText('Founding Guide')).toBeInTheDocument()
  })

  it('renders as a span element', () => {
    const { container } = wrap(<Tag>Test</Tag>)
    expect(container.querySelector('span')).toBeInTheDocument()
  })

  it('uses default amber color', () => {
    const { container } = wrap(<Tag>Default</Tag>)
    const span = container.querySelector('span')
    expect(span.style.color).toBe('rgb(200, 146, 58)')
  })

  it('applies custom color', () => {
    const { container } = wrap(<Tag color="#FF0000">Red</Tag>)
    const span = container.querySelector('span')
    expect(span.style.color).toBe('rgb(255, 0, 0)')
  })
})

describe('VerBadge', () => {
  it('renders verified text', () => {
    wrap(<VerBadge />)
    expect(screen.getByText(/Verified/)).toBeInTheDocument()
  })
})

describe('EarlyBadge', () => {
  it('renders early access text', () => {
    wrap(<EarlyBadge />)
    expect(screen.getByText(/Early Access/)).toBeInTheDocument()
  })

  it('applies custom color', () => {
    const { container } = wrap(<EarlyBadge color="#FF0000" />)
    const span = container.querySelector('span')
    expect(span.style.color).toBe('rgb(255, 0, 0)')
  })
})

describe('StatusPill', () => {
  it('renders Live Now for live vertical', () => {
    wrap(<StatusPill vertical={{ status: 'live' }} />)
    expect(screen.getByText(/Live Now/)).toBeInTheDocument()
  })

  it('renders eta for non-live vertical', () => {
    wrap(<StatusPill vertical={{ status: 'early', color: '#C8923A', accent: '#E2B96F', eta: 'Q2 2026' }} />)
    expect(screen.getByText('Q2 2026')).toBeInTheDocument()
  })
})

describe('Divider', () => {
  it('renders a div element', () => {
    const { container } = wrap(<Divider />)
    const div = container.querySelector('div > div')
    expect(div).toBeInTheDocument()
  })

  it('has h-px class', () => {
    const { container } = wrap(<Divider />)
    const div = container.querySelector('.h-px')
    expect(div).toBeInTheDocument()
  })
})

describe('Section', () => {
  it('renders children', () => {
    wrap(<Section><p>Hello</p></Section>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders as a section element', () => {
    const { container } = wrap(<Section><p>Test</p></Section>)
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('applies custom background', () => {
    const { container } = wrap(<Section bg="#FF0000"><p>Red</p></Section>)
    const section = container.querySelector('section')
    expect(section.style.background).toBe('rgb(255, 0, 0)')
  })

  it('applies custom className', () => {
    const { container } = wrap(<Section className="text-center"><p>Center</p></Section>)
    const section = container.querySelector('section')
    expect(section.className).toContain('text-center')
  })
})

describe('GuideCard', () => {
  const guide = {
    id: 1,
    name: 'Dr. Sarah',
    role: 'Psychologist',
    emoji: '🧠',
    quote: 'Helping you find clarity and purpose through evidence-based methods of change.',
    methods: ['CBT', 'Mindfulness'],
    rating: 4.9,
    review_count: 23,
    price: '$120 / hr',
    color: '#4A7A9A',
    accent: '#6AAAC8',
  }

  it('renders guide name', () => {
    wrap(<GuideCard guide={guide} onOpen={() => {}} />)
    expect(screen.getByText('Dr. Sarah')).toBeInTheDocument()
  })

  it('renders guide role', () => {
    wrap(<GuideCard guide={guide} onOpen={() => {}} />)
    expect(screen.getByText('Psychologist')).toBeInTheDocument()
  })

  it('renders rating and review count', () => {
    wrap(<GuideCard guide={guide} onOpen={() => {}} />)
    expect(screen.getByText(/4.9/)).toBeInTheDocument()
    expect(screen.getByText(/23/)).toBeInTheDocument()
  })

  it('renders price', () => {
    wrap(<GuideCard guide={guide} onOpen={() => {}} />)
    expect(screen.getByText('$120 / hr')).toBeInTheDocument()
  })

  it('renders methods', () => {
    wrap(<GuideCard guide={guide} onOpen={() => {}} />)
    expect(screen.getByText('CBT')).toBeInTheDocument()
    expect(screen.getByText('Mindfulness')).toBeInTheDocument()
  })

  it('renders emoji', () => {
    wrap(<GuideCard guide={guide} onOpen={() => {}} />)
    expect(screen.getByText('🧠')).toBeInTheDocument()
  })

  it('renders verified badge when not preview', () => {
    wrap(<GuideCard guide={guide} onOpen={() => {}} />)
    expect(screen.getByText(/Verified/)).toBeInTheDocument()
  })

  it('renders early access badge in preview mode', () => {
    wrap(<GuideCard guide={guide} onOpen={() => {}} preview />)
    expect(screen.getByText(/Early Access/)).toBeInTheDocument()
  })

  it('shows free intro call text when not preview', () => {
    wrap(<GuideCard guide={guide} onOpen={() => {}} />)
    expect(screen.getByText(/Free 30-min intro call/)).toBeInTheDocument()
  })

  it('hides free intro call text in preview mode', () => {
    wrap(<GuideCard guide={guide} onOpen={() => {}} preview />)
    expect(screen.queryByText(/Free 30-min intro call/)).not.toBeInTheDocument()
  })
})

describe('WaitlistBox', () => {
  const vertical = {
    id: 'nutrition',
    label: 'Nutrition',
    color: '#5A7A2A',
    accent: '#8AAA5A',
  }

  it('renders vertical label in heading', () => {
    wrap(<WaitlistBox vertical={vertical} />)
    expect(screen.getByText(/Nutrition/)).toBeInTheDocument()
  })

  it('renders email input', () => {
    wrap(<WaitlistBox vertical={vertical} />)
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
  })

  it('renders join button', () => {
    wrap(<WaitlistBox vertical={vertical} />)
    expect(screen.getByRole('button', { name: /Join/ })).toBeInTheDocument()
  })

  it('renders description text', () => {
    wrap(<WaitlistBox vertical={vertical} />)
    expect(screen.getByText(/Be first to access guides/)).toBeInTheDocument()
  })
})
