import { motion } from 'framer-motion'

export default function ProgressBar({ value, max, className = '', showLabel = true, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Adventure Progress</span>
          <span className="text-white">{pct}%</span>
        </div>
      )}
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundImage:
              color || 'linear-gradient(90deg,#22c55e,#38bdf8,#8b5cf6)',
            backgroundSize: '200% 100%',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
