import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { useGame } from '../context/GameContext.jsx'
import { useBreadcrumbs } from '../context/BreadcrumbContext.jsx'
import { getLevel } from '../data/levels.js'
import {
  XpIcon,
  CoinIcon,
  StarIcon,
  FlameIcon,
  PlayIcon,
  MapIcon,
  TrophyIcon,
  GearIcon,
  UserIcon,
  SparkleIcon,
} from '../components/Icons.jsx'

function StatCard({ icon, value, label, tint }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.03 }}
      className="glass flex items-center gap-3 rounded-2xl p-3"
    >
      <div className={`grid h-11 w-11 place-items-center rounded-xl ${tint}`}>
        <span className="h-6 w-6">{icon}</span>
      </div>
      <div>
        <div className="font-display text-xl font-extrabold leading-none text-white tabular-nums">
          {value}
        </div>
        <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</div>
      </div>
    </motion.div>
  )
}

function QuickLink({ to, icon: Icon, label, sub, tint }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -4, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="glass flex items-center gap-3 rounded-2xl p-4"
      >
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tint}`}>
          <span className="h-5 w-5 text-white">
            <Icon width="100%" height="100%" />
          </span>
        </div>
        <div>
          <div className="font-display font-bold text-white">{label}</div>
          <div className="text-xs text-slate-400">{sub}</div>
        </div>
      </motion.div>
    </Link>
  )
}

export default function Home() {
  useBreadcrumbs([{ label: 'Home' }])
  const { name, xp, coins, stars, level, streak, completedLevels, totalLevels, hasStarted } =
    useGame()
  const navigate = useNavigate()
  const current = getLevel(level)

  return (
    <PageTransition>
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] glass-strong p-6 shadow-card sm:p-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-quest-violet/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-quest-sky/25 blur-3xl" />

        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_.85fr]">
          {/* Left: welcome + CTAs */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-quest-gold"
            >
              <span className="h-3.5 w-3.5">
                <SparkleIcon width="100%" height="100%" />
              </span>
              A magical journey into Python
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-4 font-display text-4xl font-extrabold leading-tight text-white sm:text-6xl"
            >
              {hasStarted ? 'Welcome back,' : 'Welcome,'}
              <br />
              <span className="gradient-text">{name}!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-4 max-w-lg text-lg text-slate-300"
            >
              Travel through 12 enchanted kingdoms and learn to code in Python by
              <span className="font-bold text-white"> playing real games</span>. No boring
              textbooks — just adventure. Ready?
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(hasStarted ? `/level/${level}` : '/level/1')}
                className="btn-glow text-lg animate-pulseGlow"
              >
                <span className="h-6 w-6">
                  <PlayIcon width="100%" height="100%" />
                </span>
                {hasStarted ? 'Continue Adventure' : 'Start Adventure'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/map')}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3 font-display text-lg font-bold text-white transition hover:bg-white/20"
              >
                <span className="h-5 w-5">
                  <MapIcon width="100%" height="100%" />
                </span>
                World Map
              </motion.button>
            </motion.div>

            {hasStarted && current && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-sm text-slate-400"
              >
                Next stop: <span className="font-bold text-quest-sky">{current.emoji} {current.name}</span>
              </motion.p>
            )}
          </div>

          {/* Right: floating hero illustration */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-sm lg:block">
            <motion.div
              className="absolute inset-0 grid place-items-center"
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="relative grid h-64 w-64 place-items-center rounded-[2.5rem] bg-gradient-to-br from-quest-violet/40 to-quest-sky/30 shadow-glow">
                <div className="absolute inset-3 rounded-[2rem] border border-white/15" />
                <span className="text-[8rem] drop-shadow-[0_10px_30px_rgba(139,92,246,0.6)]">🏰</span>
              </div>
            </motion.div>
            <motion.span
              className="absolute left-2 top-6 text-4xl"
              animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              ☁️
            </motion.span>
            <motion.span
              className="absolute right-2 top-24 text-5xl"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
            >
              🐍
            </motion.span>
            <motion.span
              className="absolute bottom-6 left-10 text-4xl"
              animate={{ y: [0, -8, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </div>
        </div>
      </section>

      {/* PLAYER PROFILE STRIP */}
      <section className="mt-6">
        <div className="glass-strong rounded-3xl p-5 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 6, scale: 1.05 }}
                className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-quest-gold to-quest-ember text-3xl shadow-glow-gold"
              >
                👧
              </motion.div>
              <div>
                <div className="font-display text-xl font-extrabold text-white">{name}</div>
                <div className="text-sm text-slate-400">
                  Level {level} of {totalLevels} • {completedLevels.length} kingdoms cleared
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatCard icon={<XpIcon />} value={xp} label="XP" tint="bg-quest-purple/25" />
              <StatCard icon={<CoinIcon />} value={coins} label="Coins" tint="bg-amber-500/20" />
              <StatCard icon={<StarIcon />} value={stars} label="Stars" tint="bg-yellow-400/20" />
              <StatCard icon={<FlameIcon />} value={streak} label="Streak" tint="bg-orange-500/20" />
            </div>
          </div>

          <div className="mt-5">
            <ProgressBar value={completedLevels.length} max={totalLevels} />
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink
          to="/map"
          icon={MapIcon}
          label="World Map"
          sub="Travel the kingdoms"
          tint="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <QuickLink
          to="/achievements"
          icon={TrophyIcon}
          label="Achievements"
          sub="Your badges & trophies"
          tint="bg-gradient-to-br from-amber-400 to-orange-500"
        />
        <QuickLink
          to="/profile"
          icon={UserIcon}
          label="Player Profile"
          sub="Stats & progress"
          tint="bg-gradient-to-br from-violet-500 to-fuchsia-600"
        />
        <QuickLink
          to="/settings"
          icon={GearIcon}
          label="Settings"
          sub="Sound, motion & more"
          tint="bg-gradient-to-br from-sky-500 to-blue-600"
        />
      </section>
    </PageTransition>
  )
}
