/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', '"Fredoka"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      colors: {
        quest: {
          night: '#0b1026',
          deep: '#141a3a',
          purple: '#6d28d9',
          violet: '#8b5cf6',
          sky: '#38bdf8',
          teal: '#2dd4bf',
          grass: '#22c55e',
          gold: '#fbbf24',
          coral: '#fb7185',
          ember: '#f97316',
        },
      },
      boxShadow: {
        glow: '0 0 25px rgba(139, 92, 246, 0.55)',
        'glow-gold': '0 0 25px rgba(251, 191, 36, 0.6)',
        'glow-green': '0 0 25px rgba(34, 197, 94, 0.55)',
        card: '0 18px 40px -12px rgba(2, 6, 23, 0.55)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(139,92,246,0.55)' },
          '50%': { boxShadow: '0 0 28px 6px rgba(139,92,246,0.75)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        floatSlow: 'floatSlow 8s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite',
        shimmer: 'shimmer 6s ease infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
