import { motion } from 'framer-motion'
import { useMemo } from 'react'

const COLORS = ['#fbbf24', '#fb7185', '#8b5cf6', '#38bdf8', '#22c55e', '#f97316', '#e879f9']

// A one-shot confetti burst. Mount it when you want celebration.
export default function Confetti({ count = 90, duration = 2.6, origin = 'top' }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.sin(i * 12.9898) * 0.5 + 0.5) * 100,
        color: COLORS[i % COLORS.length],
        delay: (i % 12) * 0.05,
        rotate: (i * 47) % 360,
        drift: ((i % 7) - 3) * 30,
        size: 6 + (i % 4) * 3,
        dur: duration + ((i % 5) * 0.3),
        round: i % 3 === 0,
      })),
    [count, duration]
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: origin === 'top' ? -20 : '50%',
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            borderRadius: p.round ? '999px' : '2px',
            background: p.color,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            x: p.drift,
            rotate: p.rotate + 360,
            opacity: [1, 1, 0.9, 0],
          }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}
