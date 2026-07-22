import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from '../Confetti.jsx'
import { PlayIcon, CheckIcon, SparkleIcon } from '../Icons.jsx'

function IconBtn({ onClick, label, children, tone = 'default' }) {
  const tones = {
    default: 'bg-white/10 hover:bg-white/20 text-white',
    danger: 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-200',
  }
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-xl font-bold transition ${tones[tone]}`}
    >
      {children}
    </button>
  )
}

function Countdown({ onDone }) {
  const [n, setN] = useState(3)
  useEffect(() => {
    if (n <= 0) {
      const t = setTimeout(onDone, 500)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setN((x) => x - 1), 750)
    return () => clearTimeout(t)
  }, [n, onDone])

  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-slate-950/60 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={n}
          initial={{ scale: 0.2, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 2, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="font-display text-8xl font-extrabold text-white drop-shadow-[0_6px_20px_rgba(139,92,246,0.8)]"
        >
          {n <= 0 ? 'GO!' : n}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/**
 * Presentational shell around any game field.
 * Owns nothing but visuals + overlays. Parent (the game) drives `status`.
 */
export default function GameShell({
  title,
  accent = '#8b5cf6',
  howTo = [],
  status,
  score = null,
  onStart,
  onBeginPlay,
  onPause,
  onResume,
  onRestart,
  onContinue,
  winTitle = 'Victory!',
  winText = 'You did it, Elizabeth!',
  loseTitle = 'Try Again!',
  loseText = 'Every hero stumbles. Give it another go!',
  rewards,
  children,
  fieldClassName = '',
}) {
  const playing = status === 'playing'
  const paused = status === 'paused'

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl glass px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
          />
          <span className="font-display font-bold text-white">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {score}
          {(playing || paused) && (
            <>
              {playing ? (
                <IconBtn onClick={onPause} label="Pause">
                  <span className="flex gap-0.5">
                    <span className="h-4 w-1 rounded bg-white" />
                    <span className="h-4 w-1 rounded bg-white" />
                  </span>
                </IconBtn>
              ) : (
                <IconBtn onClick={onResume} label="Resume">
                  <span className="h-4 w-4">
                    <PlayIcon width="100%" height="100%" />
                  </span>
                </IconBtn>
              )}
              <IconBtn onClick={onRestart} label="Restart" tone="danger">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M4 12a8 8 0 108-8v3l-4-4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(0,4)"
                  />
                </svg>
              </IconBtn>
            </>
          )}
        </div>
      </div>

      {/* Field */}
      <div
        className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-card ${fieldClassName}`}
      >
        {children}

        {/* READY overlay */}
        <AnimatePresence>
          {status === 'ready' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 grid place-items-center bg-slate-950/70 p-6 backdrop-blur-sm"
            >
              <div className="max-w-md text-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mx-auto mb-3 text-5xl"
                >
                  🎮
                </motion.div>
                <h3 className="font-display text-2xl font-extrabold text-white">How to play</h3>
                <ul className="mx-auto mt-3 space-y-1.5 text-left text-sm text-slate-200">
                  {howTo.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 h-4 w-4 shrink-0 text-quest-gold">
                        <SparkleIcon width="100%" height="100%" />
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onStart}
                  className="btn-glow mt-6"
                >
                  <span className="h-5 w-5">
                    <PlayIcon width="100%" height="100%" />
                  </span>
                  Start Game
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COUNTDOWN */}
        {status === 'countdown' && <Countdown onDone={onBeginPlay} />}

        {/* PAUSED overlay */}
        <AnimatePresence>
          {paused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 grid place-items-center bg-slate-950/70 backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="font-display text-4xl font-extrabold text-white">Paused</div>
                <button onClick={onResume} className="btn-glow mt-4">
                  <span className="h-5 w-5">
                    <PlayIcon width="100%" height="100%" />
                  </span>
                  Resume
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WON overlay */}
        <AnimatePresence>
          {status === 'won' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 grid place-items-center bg-slate-950/75 p-6 backdrop-blur-sm"
            >
              <Confetti count={70} />
              <motion.div
                initial={{ scale: 0.6, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 240, damping: 16 }}
                className="glass-strong max-w-sm rounded-3xl p-7 text-center shadow-card"
              >
                <motion.div
                  animate={{ rotate: [0, -12, 12, 0], scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="mx-auto mb-2 text-6xl"
                >
                  🏆
                </motion.div>
                <h3 className="font-display text-3xl font-extrabold gradient-text">{winTitle}</h3>
                <p className="mt-2 text-slate-200">{winText}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onContinue}
                  className="btn-glow mt-6 animate-pulseGlow"
                >
                  <span className="h-5 w-5">
                    <CheckIcon width="100%" height="100%" />
                  </span>
                  See what you learned!
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOST overlay */}
        <AnimatePresence>
          {status === 'lost' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 grid place-items-center bg-slate-950/75 p-6 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.6, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 240, damping: 16 }}
                className="glass-strong max-w-sm rounded-3xl p-7 text-center shadow-card"
              >
                <div className="mx-auto mb-2 text-6xl">💫</div>
                <h3 className="font-display text-3xl font-extrabold text-white">{loseTitle}</h3>
                <p className="mt-2 text-slate-200">{loseText}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRestart}
                  className="btn-glow mt-6"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                    <path
                      d="M4 12a8 8 0 108-8v3l-4-4 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      transform="translate(0,4)"
                    />
                  </svg>
                  Try Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
