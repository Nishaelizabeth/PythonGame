import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition.jsx'

export default function NotFound() {
  return (
    <PageTransition>
      <div className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, 6, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-8xl"
          >
            🗺️
          </motion.div>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-white">
            This path leads nowhere
          </h1>
          <p className="mt-2 text-slate-300">
            Even the bravest explorers take a wrong turn. Let&rsquo;s get you back on the map!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-glow">
              Back Home
            </Link>
            <Link
              to="/map"
              className="rounded-2xl bg-white/10 px-6 py-3 font-display font-bold text-white transition hover:bg-white/20"
            >
              World Map
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
