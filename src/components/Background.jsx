import { memo } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext.jsx'

// A few deterministic star positions so they don't reshuffle each render
const STARS = Array.from({ length: 46 }, (_, i) => ({
  id: i,
  x: (i * 97) % 100,
  y: (i * 53) % 62,
  size: (i % 3) + 1,
  delay: (i % 7) * 0.6,
}))

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: (i * 71) % 100,
  duration: 14 + (i % 6) * 3,
  delay: (i % 8) * 1.4,
  size: 6 + (i % 4) * 4,
}))

function Cloud({ className, delay = 0, duration = 46, scale = 1 }) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ x: '-20vw' }}
      animate={{ x: '120vw' }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
      style={{ scale }}
    >
      <svg width="180" height="90" viewBox="0 0 180 90" fill="none">
        <g fill="rgba(255,255,255,0.10)">
          <ellipse cx="60" cy="55" rx="45" ry="28" />
          <ellipse cx="100" cy="45" rx="42" ry="32" />
          <ellipse cx="130" cy="58" rx="34" ry="24" />
          <rect x="40" y="52" width="100" height="30" rx="15" />
        </g>
      </svg>
    </motion.div>
  )
}

function Background() {
  const { settings } = useGame()
  const reduced = settings?.reducedMotion

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep gradient sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1026] via-[#141a3a] to-[#1e1145]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.25),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.18),transparent_60%)]" />

      {/* Aurora blobs */}
      {!reduced && (
        <>
          <motion.div
            className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-quest-purple/30 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-quest-sky/25 blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-quest-teal/20 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Stars */}
      <div className="absolute inset-0">
        {STARS.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* Clouds */}
      {!reduced && (
        <>
          <Cloud className="top-[12%]" duration={60} scale={1.1} />
          <Cloud className="top-[26%]" delay={8} duration={80} scale={0.8} />
          <Cloud className="top-[6%]" delay={20} duration={70} scale={0.6} />
        </>
      )}

      {/* Floating magic particles */}
      {!reduced &&
        PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              bottom: -20,
              width: p.size,
              height: p.size,
              background:
                'radial-gradient(circle, rgba(251,191,36,0.9), rgba(139,92,246,0.2))',
              boxShadow: '0 0 12px rgba(251,191,36,0.6)',
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: '-105vh', opacity: [0, 1, 0.6, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

      {/* Distant mountain silhouette */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: '32vh' }}
      >
        <path
          fill="rgba(30, 17, 69, 0.55)"
          d="M0,224 L180,150 L360,240 L540,120 L720,220 L900,110 L1080,230 L1260,140 L1440,220 L1440,320 L0,320 Z"
        />
        <path
          fill="rgba(11, 16, 38, 0.75)"
          d="M0,270 L160,210 L340,280 L520,200 L700,270 L900,190 L1120,280 L1300,210 L1440,270 L1440,320 L0,320 Z"
        />
      </svg>
    </div>
  )
}

export default memo(Background)
