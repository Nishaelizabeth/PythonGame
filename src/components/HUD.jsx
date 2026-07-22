import { motion } from 'framer-motion'
import { XpIcon, CoinIcon, StarIcon, FlameIcon } from './Icons.jsx'
import { useGame } from '../context/GameContext.jsx'

function Chip({ icon, value, label, glow }) {
  return (
    <motion.div
      layout
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 glass ${glow} no-select`}
      whileHover={{ scale: 1.06 }}
      title={label}
    >
      <span className="h-4 w-4 shrink-0">{icon}</span>
      <motion.span
        key={value}
        initial={{ scale: 1.4, color: '#fde047' }}
        animate={{ scale: 1, color: '#ffffff' }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="font-display text-sm font-bold tabular-nums"
      >
        {value}
      </motion.span>
    </motion.div>
  )
}

export default function HUD({ compact = false }) {
  const { xp, coins, stars, streak } = useGame()
  return (
    <div className="flex items-center gap-2">
      <Chip icon={<XpIcon />} value={xp} label="Experience Points" glow="shadow-glow" />
      <Chip icon={<CoinIcon />} value={coins} label="Coins" glow="shadow-glow-gold" />
      {!compact && <Chip icon={<StarIcon />} value={stars} label="Stars" glow="" />}
      {!compact && (
        <Chip icon={<FlameIcon />} value={`${streak}🔥`} label="Daily streak" glow="" />
      )}
    </div>
  )
}
