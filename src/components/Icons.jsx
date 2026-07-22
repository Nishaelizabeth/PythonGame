// Small inline SVG icons so the app is fully offline (no icon libraries).
// Every icon defaults to filling its parent box (width/height 100%, block),
// so wrapping it in an `h-4 w-4` span controls its size.
function Svg({ children, fill = 'none', width = '100%', height = '100%', style, ...p }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill={fill}
      style={{ display: 'block', ...style }}
      {...p}
    >
      {children}
    </svg>
  )
}

export const XpIcon = (p) => (
  <Svg {...p}>
    <path
      d="M12 2l2.9 6.1L21 9l-4.6 4.3L17.6 20 12 16.7 6.4 20l1.2-6.7L3 9l6.1-.9L12 2z"
      fill="url(#xpg)"
      stroke="rgba(255,255,255,.5)"
      strokeWidth="1"
    />
    <defs>
      <linearGradient id="xpg" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#c084fc" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </Svg>
)

export const CoinIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" fill="url(#cg)" stroke="#b45309" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="6" fill="none" stroke="#fde68a" strokeWidth="1.3" />
    <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill="#92400e">
      $
    </text>
    <defs>
      <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#fde047" />
        <stop offset="1" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
  </Svg>
)

export const StarIcon = (p) => (
  <Svg {...p}>
    <path
      d="M12 2.5l2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 16.9 6.5 20l1.1-6.3L3 9.1l6.3-.9L12 2.5z"
      fill="url(#sg)"
      stroke="#f59e0b"
      strokeWidth="1"
    />
    <defs>
      <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#fef08a" />
        <stop offset="1" stopColor="#facc15" />
      </linearGradient>
    </defs>
  </Svg>
)

export const HeartIcon = (p) => (
  <Svg {...p}>
    <path
      d="M12 21s-7.5-4.7-10-9.3C.6 8.9 2 5.5 5.2 5.1 7.2 4.8 8.9 6 12 8.5 15.1 6 16.8 4.8 18.8 5.1 22 5.5 23.4 8.9 22 11.7 19.5 16.3 12 21 12 21z"
      fill="url(#hg)"
    />
    <defs>
      <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#fb7185" />
        <stop offset="1" stopColor="#e11d48" />
      </linearGradient>
    </defs>
  </Svg>
)

export const FlameIcon = (p) => (
  <Svg {...p}>
    <path
      d="M12 2c1 3-1.5 4-1.5 6.5C10.5 10 12 11 12 11s1-1.2 1-2.7C15 10 16 12 16 14a4 4 0 11-8 0c0-3 4-4 4-12z"
      fill="url(#fg)"
    />
    <defs>
      <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#fde047" />
        <stop offset="1" stopColor="#f97316" />
      </linearGradient>
    </defs>
  </Svg>
)

export const LockIcon = (p) => (
  <Svg {...p}>
    <rect x="4" y="10" width="16" height="11" rx="2.5" fill="currentColor" opacity="0.9" />
    <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="15" r="1.6" fill="#1e1b4b" />
  </Svg>
)

export const CheckIcon = (p) => (
  <Svg {...p}>
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

export const PlayIcon = (p) => (
  <Svg fill="currentColor" {...p}>
    <path d="M8 5v14l11-7z" />
  </Svg>
)

export const HomeIcon = (p) => (
  <Svg {...p}>
    <path d="M3 11l9-7 9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 10v10h14V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

export const MapIcon = (p) => (
  <Svg {...p}>
    <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="2" />
  </Svg>
)

export const TrophyIcon = (p) => (
  <Svg {...p}>
    <path d="M6 4h12v4a6 6 0 01-12 0V4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M6 6H3v2a3 3 0 003 3M18 6h3v2a3 3 0 01-3 3M9 18h6M10 15h4v3h-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </Svg>
)

export const UserIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </Svg>
)

export const GearIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
)

export const ChevronIcon = (p) => (
  <Svg {...p}>
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)

export const SparkleIcon = (p) => (
  <Svg fill="currentColor" {...p}>
    <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
    <path d="M19 14l.9 2.5L22 17l-2.1.5L19 20l-.9-2.5L16 17l2.1-.5L19 14z" opacity=".7" />
  </Svg>
)
