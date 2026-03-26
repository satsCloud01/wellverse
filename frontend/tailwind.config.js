/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
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
        mist: '#8A9E96',
        wine: '#6A2A40',
        rose: '#B46278',
        teal: '#2A6A60',
        pine: '#3A9A78',
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", 'Georgia', 'serif'],
        body: ["'Outfit'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}
