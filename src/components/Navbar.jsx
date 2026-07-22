import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import HUD from './HUD.jsx'
import {
  HomeIcon,
  MapIcon,
  PlayIcon,
  TrophyIcon,
  UserIcon,
  GearIcon,
} from './Icons.jsx'

const links = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/map', label: 'World Map', icon: MapIcon },
  { to: '/continue', label: 'Continue', icon: PlayIcon },
  { to: '/achievements', label: 'Achievements', icon: TrophyIcon },
  { to: '/profile', label: 'Profile', icon: UserIcon },
  { to: '/settings', label: 'Settings', icon: GearIcon },
]

function Item({ to, label, icon: Icon, end }) {
  return (
    <NavLink to={to} end={end} className="relative">
      {({ isActive }) => (
        <motion.div
          whileHover={{ y: -2, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
            isActive ? 'text-white' : 'text-slate-300 hover:text-white'
          }`}
        >
          <span className="h-4 w-4">
            <Icon width="100%" height="100%" />
          </span>
          <span className="hidden lg:inline">{label}</span>
          {isActive && (
            <motion.span
              layoutId="nav-active"
              className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-quest-purple/70 to-quest-sky/60 shadow-glow"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </motion.div>
      )}
    </NavLink>
  )
}

export default function Navbar() {
  const { name } = useGame()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-3 pt-3">
        <div className="glass-strong flex items-center justify-between gap-2 rounded-2xl px-3 py-2 shadow-card">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.08 }}
              className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-quest-violet to-quest-sky shadow-glow"
            >
              <span className="font-display text-lg font-extrabold text-white">🐍</span>
            </motion.div>
            <div className="leading-tight">
              <div className="font-display text-base font-extrabold gradient-text">Python Quest</div>
              <div className="hidden text-[10px] font-semibold text-slate-400 sm:block">
                {name}&rsquo;s Adventure
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Item key={l.to} {...l} />
            ))}
          </nav>

          {/* HUD */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <HUD compact />
            </div>
            {/* Mobile menu button */}
            <button
              className="grid h-9 w-9 place-items-center rounded-xl glass md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              <div className="space-y-1">
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
                <span className="block h-0.5 w-5 bg-white" />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong mt-2 grid grid-cols-2 gap-2 rounded-2xl p-3 md:hidden"
          >
            {links.map((l) => {
              const Icon = l.icon
              return (
                <button
                  key={l.to}
                  onClick={() => {
                    navigate(l.to)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm font-bold text-slate-200"
                >
                  <span className="h-4 w-4">
                    <Icon width="100%" height="100%" />
                  </span>
                  {l.label}
                </button>
              )
            })}
          </motion.nav>
        )}
      </div>
    </header>
  )
}
