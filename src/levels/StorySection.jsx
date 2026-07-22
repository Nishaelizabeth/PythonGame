import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext.jsx'
import { PlayIcon, SparkleIcon } from '../components/Icons.jsx'

// A big decorative scene illustration made from layered emoji + gradients.
function SceneArt({ level }) {
  return (
    <div
      className={`relative grid h-56 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br ${level.gradient} sm:h-72`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-6 top-5 text-3xl opacity-90 animate-floatSlow">☁️</span>
        <span className="absolute right-8 top-8 text-2xl opacity-80 animate-float">✨</span>
        <span className="absolute bottom-6 left-10 text-2xl opacity-80">🌟</span>
        <span className="absolute bottom-8 right-12 text-2xl opacity-70 animate-floatSlow">💫</span>
      </div>
      <motion.div
        animate={{ y: [0, -12, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative text-[7rem] drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] sm:text-[9rem]"
      >
        {level.emoji}
      </motion.div>
    </div>
  )
}

export default function StorySection({ level, onBegin }) {
  const { name } = useGame()
  const story = level.story
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6 lg:grid-cols-2"
    >
      <div>
        <SceneArt level={level} />
      </div>

      <div className="flex flex-col">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-quest-gold">
          <span className="h-3.5 w-3.5">
            <SparkleIcon width="100%" height="100%" />
          </span>
          Kingdom {level.id} • {level.subtitle}
        </div>

        <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
          {story.title}
        </h2>

        <div className="mt-3 space-y-3 text-slate-200">
          {story.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.12 }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-quest-gold/40 bg-quest-gold/10 p-4">
            <div className="text-xs font-extrabold uppercase tracking-wide text-quest-gold">
              🎯 Your Mission
            </div>
            <p className="mt-1 text-sm text-white">{story.mission}</p>
          </div>
          <div className="rounded-2xl border border-quest-sky/40 bg-quest-sky/10 p-4">
            <div className="text-xs font-extrabold uppercase tracking-wide text-quest-sky">
              🧭 Objective
            </div>
            <p className="mt-1 text-sm text-white">{story.objective}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {level.topics.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200"
            >
              {t}
            </span>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onBegin}
          className="btn-glow mt-6 w-full animate-pulseGlow sm:w-fit"
        >
          <span className="h-5 w-5">
            <PlayIcon width="100%" height="100%" />
          </span>
          Begin the Mission, {name}!
        </motion.button>
      </div>
    </motion.div>
  )
}
