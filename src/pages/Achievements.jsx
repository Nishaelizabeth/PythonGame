import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'
import { useGame } from '../context/GameContext.jsx'
import { useBreadcrumbs } from '../context/BreadcrumbContext.jsx'
import { LockIcon } from '../components/Icons.jsx'

export default function Achievements() {
  useBreadcrumbs([{ label: 'Achievements' }])
  const { achievements, allAchievements, name } = useGame()
  const earned = achievements.length
  const total = allAchievements.length

  return (
    <PageTransition>
      <div className="mb-5 text-center">
        <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
          {name}&rsquo;s <span className="gradient-text">Trophy Hall</span>
        </h1>
        <p className="mt-1 text-slate-300">
          You&rsquo;ve unlocked <span className="font-bold text-quest-gold">{earned}</span> of {total}{' '}
          badges. Keep adventuring to collect them all!
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allAchievements.map((a, i) => {
          const unlocked = achievements.includes(a.id)
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative overflow-hidden rounded-3xl p-5 text-center shadow-card ${
                unlocked ? 'glass-strong' : 'glass'
              }`}
            >
              {unlocked && (
                <div className="pointer-events-none absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-quest-gold/30 blur-2xl" />
              )}
              <div
                className={`mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br text-4xl ${
                  unlocked ? a.color + ' shadow-glow-gold' : 'from-slate-700 to-slate-800'
                }`}
              >
                {unlocked ? (
                  <motion.span
                    animate={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {a.emoji}
                  </motion.span>
                ) : (
                  <span className="h-8 w-8 text-slate-500">
                    <LockIcon width="100%" height="100%" />
                  </span>
                )}
              </div>
              <h3 className={`mt-3 font-display text-lg font-extrabold ${unlocked ? 'text-white' : 'text-slate-500'}`}>
                {a.name}
              </h3>
              <p className={`mt-1 text-sm ${unlocked ? 'text-slate-300' : 'text-slate-600'}`}>{a.desc}</p>
              <div
                className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                  unlocked ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/5 text-slate-500'
                }`}
              >
                {unlocked ? '✓ Unlocked' : 'Locked'}
              </div>
            </motion.div>
          )
        })}
      </div>
    </PageTransition>
  )
}
