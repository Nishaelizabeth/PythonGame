import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext.jsx'
import { getLevel } from '../data/levels.js'
import { PlayIcon, FlameIcon } from './Icons.jsx'

export default function WelcomeBack() {
  const { returning, dismissReturning, name, level, streak } = useGame()
  const navigate = useNavigate()
  const next = getLevel(level)

  return (
    <AnimatePresence>
      {returning && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissReturning}
        >
          <motion.div
            className="glass-strong relative w-full max-w-md overflow-hidden rounded-3xl p-8 text-center shadow-card"
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-quest-violet/40 blur-3xl" />
            <motion.div
              className="mx-auto mb-3 text-6xl"
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              🌟
            </motion.div>
            <h2 className="font-display text-3xl font-extrabold text-white">
              Welcome back, {name}!
            </h2>
            <p className="mt-2 text-slate-300">
              Your adventure is waiting. You&rsquo;re up to{' '}
              <span className="font-bold text-quest-sky">{next?.name}</span>.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-4 py-1.5 text-sm font-bold text-orange-300">
              <span className="h-4 w-4">
                <FlameIcon width="100%" height="100%" />
              </span>
              {streak} day streak — keep it going!
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                className="btn-glow w-full"
                onClick={() => {
                  dismissReturning()
                  navigate(`/level/${level}`)
                }}
              >
                <span className="h-5 w-5">
                  <PlayIcon width="100%" height="100%" />
                </span>
                Continue Adventure
              </button>
              <button
                className="w-full rounded-2xl bg-white/10 px-6 py-2.5 font-display font-bold text-slate-200 transition hover:bg-white/20"
                onClick={() => {
                  dismissReturning()
                  navigate('/map')
                }}
              >
                Open World Map
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
