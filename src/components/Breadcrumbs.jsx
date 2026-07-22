import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useBreadcrumbTrail } from '../context/BreadcrumbContext.jsx'
import { ChevronIcon, HomeIcon } from './Icons.jsx'

export default function Breadcrumbs() {
  const trail = useBreadcrumbTrail()
  if (!trail || trail.length === 0) return null

  return (
    <div className="mx-auto max-w-7xl px-4 pt-3">
      <motion.nav
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-1.5 rounded-xl glass px-3 py-1.5 text-xs font-bold text-slate-300"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="grid h-4 w-4 place-items-center text-slate-400 hover:text-white">
          <HomeIcon width="100%" height="100%" />
        </Link>
        <AnimatePresence mode="popLayout">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1
            return (
              <motion.span
                key={crumb.label + i}
                layout
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5"
              >
                <span className="h-3.5 w-3.5 text-slate-500">
                  <ChevronIcon width="100%" height="100%" />
                </span>
                {last || !crumb.to ? (
                  <span className="text-white">{crumb.label}</span>
                ) : (
                  <Link to={crumb.to} className="text-slate-300 transition-colors hover:text-quest-sky">
                    {crumb.label}
                  </Link>
                )}
              </motion.span>
            )
          })}
        </AnimatePresence>
      </motion.nav>
    </div>
  )
}
