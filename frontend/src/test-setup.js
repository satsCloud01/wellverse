import '@testing-library/jest-dom'

// Mock canvas for FloatingParticles component
HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: () => {},
  beginPath: () => {},
  arc: () => {},
  fill: () => {},
  fillStyle: '',
})

// Mock IntersectionObserver for FadeInOnScroll
globalThis.IntersectionObserver = class {
  constructor(cb) { this.cb = cb }
  observe() {}
  unobserve() {}
  disconnect() {}
}
