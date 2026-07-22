import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'
import { useGame } from '../context/GameContext.jsx'
import { useBreadcrumbs } from '../context/BreadcrumbContext.jsx'

function Toggle({ on, onClick, label, desc, emoji }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl glass p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <div className="font-display font-bold text-white">{label}</div>
          <div className="text-xs text-slate-400">{desc}</div>
        </div>
      </div>
      <button
        onClick={onClick}
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
          on ? 'bg-gradient-to-r from-quest-purple to-quest-sky' : 'bg-white/15'
        }`}
        aria-pressed={on}
        aria-label={label}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow ${on ? 'right-1' : 'left-1'}`}
        />
      </button>
    </div>
  )
}

export default function Settings() {
  useBreadcrumbs([{ label: 'Settings' }])
  const { settings, updateSettings, resetProgress, name } = useGame()
  const [confirm, setConfirm] = useState(false)
  const navigate = useNavigate()

  const doReset = () => {
    resetProgress()
    setConfirm(false)
    navigate('/')
  }

  return (
    <PageTransition>
      <div className="mb-5 text-center">
        <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="mt-1 text-slate-300">Make Python Quest just right for you, {name}.</p>
      </div>

      <div className="mx-auto max-w-2xl space-y-3">
        <Toggle
          emoji="🎵"
          label="Music"
          desc="Background adventure music"
          on={settings.music}
          onClick={() => updateSettings({ music: !settings.music })}
        />
        <Toggle
          emoji="🔊"
          label="Sound Effects"
          desc="Clicks, wins and sparkles"
          on={settings.sfx}
          onClick={() => updateSettings({ sfx: !settings.sfx })}
        />
        <Toggle
          emoji="🌙"
          label="Reduced Motion"
          desc="Calmer background with fewer moving effects"
          on={settings.reducedMotion}
          onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
        />
        <Toggle
          emoji="🌈"
          label="High Contrast"
          desc="Brighter, bolder colors for easier reading"
          on={settings.highContrast}
          onClick={() => updateSettings({ highContrast: !settings.highContrast })}
        />

        {/* Danger zone */}
        <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
          <div className="font-display font-bold text-rose-200">Start Over</div>
          <p className="mt-1 text-sm text-slate-300">
            This erases all progress, XP, coins and badges and begins the adventure fresh from Level 1.
          </p>
          <button
            onClick={() => setConfirm(true)}
            className="mt-3 rounded-xl bg-rose-500/80 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-500"
          >
            Reset all progress
          </button>
        </div>

        <p className="pt-2 text-center text-xs text-slate-500">
          All progress is saved automatically in your browser. No account needed — everything works offline. 🔒
        </p>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirm(false)}
          >
            <motion.div
              className="glass-strong w-full max-w-sm rounded-3xl p-6 text-center shadow-card"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 text-5xl">⚠️</div>
              <h3 className="font-display text-2xl font-extrabold text-white">Are you sure?</h3>
              <p className="mt-2 text-slate-300">
                All of {name}&rsquo;s hard-earned progress will be lost. This cannot be undone.
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setConfirm(false)}
                  className="flex-1 rounded-2xl bg-white/10 px-4 py-2.5 font-display font-bold text-white transition hover:bg-white/20"
                >
                  Keep my progress
                </button>
                <button
                  onClick={doReset}
                  className="flex-1 rounded-2xl bg-rose-500 px-4 py-2.5 font-display font-bold text-white transition hover:bg-rose-600"
                >
                  Yes, reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
