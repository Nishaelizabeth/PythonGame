import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'
import StorySection from '../levels/StorySection.jsx'
import ReflectionSection from '../levels/ReflectionSection.jsx'
import GAMES from '../levels/games/index.js'
import { useGame } from '../context/GameContext.jsx'
import { useBreadcrumbs } from '../context/BreadcrumbContext.jsx'
import { getLevel, LEVELS } from '../data/levels.js'
import { CheckIcon } from '../components/Icons.jsx'

const SECTION_LABELS = {
  story: 'Story',
  game: 'The Game',
  reflection: 'Learning Reflection',
}

function SectionStepper({ section }) {
  const order = ['story', 'game', 'reflection']
  const idx = order.indexOf(section)
  return (
    <div className="mx-auto mb-5 flex max-w-xl items-center justify-center gap-1.5">
      {order.map((s, i) => {
        const done = i < idx
        const active = i === idx
        return (
          <div key={s} className="flex flex-1 items-center gap-1.5">
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                active
                  ? 'bg-gradient-to-r from-quest-purple to-quest-sky text-white shadow-glow'
                  : done
                  ? 'bg-emerald-500/20 text-emerald-200'
                  : 'bg-white/5 text-slate-400'
              }`}
            >
              <span
                className={`grid h-4 w-4 place-items-center rounded-full text-[10px] ${
                  done ? 'bg-emerald-400 text-slate-900' : active ? 'bg-white/30' : 'bg-white/10'
                }`}
              >
                {done ? (
                  <span className="h-2.5 w-2.5">
                    <CheckIcon width="100%" height="100%" />
                  </span>
                ) : (
                  i + 1
                )}
              </span>
              <span className="hidden sm:inline">{SECTION_LABELS[s]}</span>
            </div>
            {i < order.length - 1 && (
              <div className={`h-0.5 flex-1 rounded ${done ? 'bg-emerald-400/60' : 'bg-white/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Level() {
  const { id } = useParams()
  const levelId = Number(id)
  const level = getLevel(levelId)
  const navigate = useNavigate()
  const { isUnlocked, completeLevel, unlockAchievement } = useGame()

  const [section, setSection] = useState('story')

  // reset section whenever the level id changes
  useEffect(() => {
    setSection('story')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [levelId])

  // smooth scroll to top on section change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [section])

  useBreadcrumbs(
    level
      ? [
          { label: 'World Map', to: '/map' },
          { label: level.name, to: null },
          { label: SECTION_LABELS[section] },
        ]
      : [{ label: 'World Map', to: '/map' }]
  )

  if (!level) return <Navigate to="/map" replace />
  if (!isUnlocked(levelId)) return <Navigate to="/map" replace />

  const GameComponent = GAMES[levelId]

  const finishAdventure = () => {
    completeLevel(levelId, level.rewards)
    if (level.rewards.badge) unlockAchievement(level.rewards.badge)
    const next = LEVELS.find((l) => l.id === levelId + 1)
    if (next) navigate('/map')
    else navigate('/achievements')
  }

  return (
    <PageTransition>
      {/* Header */}
      <div className="mb-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
          <span>{level.emoji}</span> Kingdom {level.id} of {LEVELS.length}
        </div>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
          {level.name}
        </h1>
      </div>

      <SectionStepper section={section} />

      <AnimatePresence mode="wait">
        {/* ---------- SECTION 1: STORY ---------- */}
        {section === 'story' && (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <StorySection level={level} onBegin={() => setSection('game')} />
          </motion.div>
        )}

        {/* ---------- SECTION 2: THE GAME ---------- */}
        {section === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            {GameComponent ? (
              <GameComponent level={level} onComplete={() => setSection('reflection')} />
            ) : (
              <div className="glass-strong rounded-3xl p-10 text-center text-slate-300">
                This game is coming soon.
                <div className="mt-4">
                  <button className="btn-glow" onClick={() => setSection('reflection')}>
                    Skip to Reflection
                  </button>
                </div>
              </div>
            )}
            <div className="mt-4 text-center">
              <button
                onClick={() => setSection('story')}
                className="text-sm font-bold text-slate-400 underline-offset-2 hover:text-white hover:underline"
              >
                ← Back to story
              </button>
            </div>
          </motion.div>
        )}

        {/* ---------- SECTION 3: REFLECTION ---------- */}
        {section === 'reflection' && (
          <motion.div
            key="reflection"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <ReflectionSection level={level} onContinueAdventure={finishAdventure} />
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
