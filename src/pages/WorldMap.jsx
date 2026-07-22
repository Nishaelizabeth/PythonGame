import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'
import { useGame } from '../context/GameContext.jsx'
import { useBreadcrumbs } from '../context/BreadcrumbContext.jsx'
import { LEVELS } from '../data/levels.js'
import { LockIcon, CheckIcon, StarIcon, PlayIcon } from '../components/Icons.jsx'

function buildPath(levels) {
  return levels
    .map((l, i) => `${i === 0 ? 'M' : 'L'} ${l.pos.x} ${l.pos.y}`)
    .join(' ')
}

export default function WorldMap() {
  useBreadcrumbs([{ label: 'World Map' }])
  const { isUnlocked, isCompleted, level, name, completedLevels, totalLevels } = useGame()
  const navigate = useNavigate()
  const [locked, setLocked] = useState(null) // level object user tried to open while locked

  const fullPath = buildPath(LEVELS)
  const doneCount = LEVELS.filter((l) => isCompleted(l.id)).length

  const handleClick = (lvl) => {
    if (isUnlocked(lvl.id)) navigate(`/level/${lvl.id}`)
    else setLocked(lvl)
  }

  return (
    <PageTransition>
      <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            The World of <span className="gradient-text">Python Quest</span>
          </h1>
          <p className="text-slate-300">
            Choose your kingdom, {name}. Green means conquered, glowing means it&rsquo;s your turn!
          </p>
        </div>
        <div className="glass rounded-2xl px-4 py-2 text-sm font-bold text-white">
          {doneCount}/{totalLevels} kingdoms cleared
        </div>
      </div>

      {/* MAP */}
      <div className="relative w-full overflow-hidden rounded-[2rem] glass-strong shadow-card">
        {/* textured backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-indigo-900/10 to-fuchsia-900/20" />
        <div className="absolute inset-0 pixel-grid opacity-40" />

        {/* Decorative scenery */}
        <div className="pointer-events-none absolute inset-0 select-none">
          <span className="absolute left-[6%] top-[10%] text-4xl opacity-70 animate-floatSlow">☁️</span>
          <span className="absolute right-[10%] top-[8%] text-5xl opacity-60 animate-float">☁️</span>
          <span className="absolute left-[45%] top-[40%] text-3xl opacity-50 animate-floatSlow">🌤️</span>
          <span className="absolute bottom-[6%] left-[3%] text-4xl opacity-70">🌲</span>
          <span className="absolute bottom-[4%] right-[6%] text-4xl opacity-70">🏔️</span>
        </div>

        {/* aspect ratio box */}
        <div className="relative w-full" style={{ paddingBottom: '58%' }}>
          {/* Roads */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* base road */}
            <path
              d={fullPath}
              fill="none"
              stroke="rgba(15,23,42,0.55)"
              strokeWidth="7"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={fullPath}
              fill="none"
              stroke="rgba(148,163,184,0.35)"
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="1 3"
              vectorEffect="non-scaling-stroke"
            />
            {/* completed segments in green */}
            {LEVELS.slice(0, -1).map((l, i) => {
              const next = LEVELS[i + 1]
              const active = isCompleted(l.id)
              if (!active) return null
              return (
                <path
                  key={l.id}
                  d={`M ${l.pos.x} ${l.pos.y} L ${next.pos.x} ${next.pos.y}`}
                  fill="none"
                  stroke="url(#roadGreen)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
            <defs>
              <linearGradient id="roadGreen" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#4ade80" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>

          {/* Level nodes */}
          {LEVELS.map((lvl, i) => {
            const unlocked = isUnlocked(lvl.id)
            const completed = isCompleted(lvl.id)
            const isFrontier = lvl.id === level && !completed
            return (
              <div
                key={lvl.id}
                className="absolute"
                style={{
                  left: `${lvl.pos.x}%`,
                  top: `${lvl.pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.06, type: 'spring', stiffness: 260, damping: 18 }}
                  whileHover={{ scale: 1.14, zIndex: 20 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleClick(lvl)}
                  className="group relative grid place-items-center"
                  aria-label={lvl.name}
                >
                  {/* glow ring for frontier */}
                  {isFrontier && (
                    <motion.span
                      className="absolute inset-0 -m-2 rounded-full"
                      style={{ boxShadow: '0 0 0 3px rgba(251,191,36,0.7)' }}
                      animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0, 0.9] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  )}

                  <div
                    className={`relative grid h-14 w-14 place-items-center rounded-2xl border-2 text-2xl transition-all sm:h-16 sm:w-16 sm:text-3xl ${
                      completed
                        ? 'border-emerald-300 bg-gradient-to-br from-emerald-400 to-teal-600 shadow-glow-green'
                        : isFrontier
                        ? 'border-amber-300 bg-gradient-to-br ' +
                          lvl.gradient +
                          ' shadow-glow animate-pulseGlow'
                        : unlocked
                        ? 'border-white/40 bg-gradient-to-br ' + lvl.gradient
                        : 'border-white/10 bg-slate-800/80 grayscale'
                    }`}
                  >
                    {unlocked ? (
                      <span className={unlocked ? '' : 'opacity-40'}>{lvl.emoji}</span>
                    ) : (
                      <span className="h-6 w-6 text-slate-400">
                        <LockIcon width="100%" height="100%" />
                      </span>
                    )}

                    {/* completed check badge */}
                    {completed && (
                      <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-[#141a3a]">
                        <span className="h-3 w-3">
                          <CheckIcon width="100%" height="100%" />
                        </span>
                      </span>
                    )}

                    {/* level number badge */}
                    <span className="absolute -left-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#141a3a] px-1 text-[10px] font-extrabold text-white ring-2 ring-white/20">
                      {lvl.id}
                    </span>
                  </div>

                  {/* label */}
                  <div
                    className={`mt-1 max-w-[92px] text-center text-[10px] font-bold leading-tight sm:text-xs ${
                      unlocked ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {lvl.name}
                  </div>
                </motion.button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="h-4 w-4 rounded-md bg-gradient-to-br from-emerald-400 to-teal-600" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-4 w-4 rounded-md bg-gradient-to-br from-quest-violet to-quest-sky shadow-glow" /> Unlocked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="grid h-4 w-4 place-items-center rounded-md bg-slate-700 text-slate-400">
            <span className="h-2.5 w-2.5">
              <LockIcon width="100%" height="100%" />
            </span>
          </span>
          Locked
        </span>
      </div>

      {/* Locked modal */}
      <AnimatePresence>
        {locked && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLocked(null)}
          >
            <motion.div
              className="glass-strong w-full max-w-sm rounded-3xl p-6 text-center shadow-card"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-2xl bg-slate-700 text-slate-300">
                <span className="h-8 w-8">
                  <LockIcon width="100%" height="100%" />
                </span>
              </div>
              <h3 className="font-display text-2xl font-extrabold text-white">
                {locked.emoji} {locked.name} is locked
              </h3>
              <p className="mt-2 text-slate-300">
                This kingdom opens after you clear{' '}
                <span className="font-bold text-quest-sky">
                  {LEVELS[locked.id - 2]?.name || 'the previous kingdom'}
                </span>
                . Adventures unlock one at a time so you always know exactly where to go next!
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <button
                  className="btn-glow w-full"
                  onClick={() => {
                    setLocked(null)
                    navigate(`/level/${level}`)
                  }}
                >
                  <span className="h-5 w-5">
                    <PlayIcon width="100%" height="100%" />
                  </span>
                  Go to my current kingdom
                </button>
                <button
                  className="w-full rounded-2xl bg-white/10 px-6 py-2.5 font-display font-bold text-slate-200 transition hover:bg-white/20"
                  onClick={() => setLocked(null)}
                >
                  Back to map
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
