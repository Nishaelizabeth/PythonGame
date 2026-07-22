import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { useGame } from '../context/GameContext.jsx'
import { useBreadcrumbs } from '../context/BreadcrumbContext.jsx'
import { LEVELS } from '../data/levels.js'
import { XpIcon, CoinIcon, StarIcon, FlameIcon, CheckIcon, LockIcon, PlayIcon } from '../components/Icons.jsx'

function Stat({ icon, label, value, tint }) {
  return (
    <div className="glass flex flex-col items-center rounded-2xl p-4">
      <span className={`grid h-12 w-12 place-items-center rounded-xl ${tint}`}>
        <span className="h-7 w-7">{icon}</span>
      </span>
      <div className="mt-2 font-display text-2xl font-extrabold text-white tabular-nums">{value}</div>
      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  )
}

export default function Profile() {
  useBreadcrumbs([{ label: 'Player Profile' }])
  const { name, xp, coins, stars, streak, level, completedLevels, achievements, totalLevels, isUnlocked, isCompleted } =
    useGame()
  const navigate = useNavigate()

  const rank =
    completedLevels.length >= 12
      ? 'Grand Wizard 👑'
      : completedLevels.length >= 9
      ? 'Loop Legend 🔁'
      : completedLevels.length >= 6
      ? 'Logic Master 🧭'
      : completedLevels.length >= 3
      ? 'Rising Coder 🌱'
      : completedLevels.length >= 1
      ? 'Apprentice 👣'
      : 'Newcomer ✨'

  return (
    <PageTransition>
      {/* Header card */}
      <div className="glass-strong relative overflow-hidden rounded-3xl p-6 shadow-card">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-quest-violet/30 blur-3xl" />
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.05 }}
            className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-quest-gold to-quest-ember text-5xl shadow-glow-gold"
          >
            👧
          </motion.div>
          <div className="text-center sm:text-left">
            <h1 className="font-display text-3xl font-extrabold text-white">{name}</h1>
            <div className="mt-1 inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-quest-gold">
              Rank: {rank}
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Currently exploring kingdom {level} of {totalLevels} • {achievements.length} badges earned
            </p>
          </div>
        </div>

        <div className="mt-5">
          <ProgressBar value={completedLevels.length} max={totalLevels} />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<XpIcon />} label="XP" value={xp} tint="bg-quest-purple/25" />
        <Stat icon={<CoinIcon />} label="Coins" value={coins} tint="bg-amber-500/20" />
        <Stat icon={<StarIcon />} label="Stars" value={stars} tint="bg-yellow-400/20" />
        <Stat icon={<FlameIcon />} label="Day Streak" value={streak} tint="bg-orange-500/20" />
      </div>

      {/* Journey checklist */}
      <div className="mt-6 glass-strong rounded-3xl p-5 shadow-card">
        <h2 className="mb-3 font-display text-xl font-extrabold text-white">Your Journey</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {LEVELS.map((l) => {
            const done = isCompleted(l.id)
            const open = isUnlocked(l.id)
            return (
              <button
                key={l.id}
                onClick={() => open && navigate(`/level/${l.id}`)}
                disabled={!open}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  done
                    ? 'border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/20'
                    : open
                    ? 'border-quest-sky/40 bg-quest-sky/10 hover:bg-quest-sky/20'
                    : 'border-white/5 bg-white/5 opacity-60'
                }`}
              >
                <span className="text-2xl">{l.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-sm font-bold text-white">
                    {l.id}. {l.name}
                  </div>
                  <div className="truncate text-xs text-slate-400">{l.topics.join(' • ')}</div>
                </div>
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                    done ? 'bg-emerald-500 text-white' : open ? 'bg-quest-sky/30 text-white' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {done ? (
                    <span className="h-4 w-4">
                      <CheckIcon width="100%" height="100%" />
                    </span>
                  ) : open ? (
                    <span className="h-3.5 w-3.5">
                      <PlayIcon width="100%" height="100%" />
                    </span>
                  ) : (
                    <span className="h-3.5 w-3.5">
                      <LockIcon width="100%" height="100%" />
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </PageTransition>
  )
}
