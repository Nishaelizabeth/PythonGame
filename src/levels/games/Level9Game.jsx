import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/game/GameShell.jsx'
import useGameMachine from '../../components/game/useGameMachine.js'
import useRaf from '../../components/game/useRaf.js'

const WAVES = [4, 5, 6]
const SPEEDS = [7.5, 9, 10.5]

export default function Level9Game({ level, onComplete }) {
  const m = useGameMachine()
  const [zombies, setZombies] = useState([])
  const [waveNum, setWaveNum] = useState(1)
  const [zapped, setZapped] = useState(0)
  const [between, setBetween] = useState('')
  const zref = useRef([])
  const waveIdxRef = useRef(0)
  const zappedRef = useRef(0)
  const idRef = useRef(0)
  const betweenRef = useRef(false)
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const reset = useCallback(() => {
    clearTimers()
    zref.current = []
    waveIdxRef.current = 0
    zappedRef.current = 0
    idRef.current = 0
    betweenRef.current = false
    setZombies([])
    setWaveNum(1)
    setZapped(0)
    setBetween('')
  }, [])

  useEffect(() => reset(), [m.runId, reset])
  useEffect(() => () => clearTimers(), [])

  const startWave = useCallback((i) => {
    const n = WAVES[i]
    const list = Array.from({ length: n }, (_, k) => {
      idRef.current += 1
      return {
        id: idRef.current,
        x: 10 + (k / Math.max(1, n - 1)) * 78 + (Math.random() * 8 - 4),
        y: -10 - k * 16 - Math.random() * 8,
        speed: SPEEDS[i],
      }
    })
    zref.current = list
    betweenRef.current = false
    zappedRef.current = 0
    setZombies(list)
    setWaveNum(i + 1)
    setZapped(0)
    setBetween('')
  }, [])

  const beginPlay = useCallback(() => {
    m.beginPlay()
    startWave(0)
  }, [m, startWave])

  const zap = useCallback(
    (id) => {
      if (m.status !== 'playing' || betweenRef.current) return
      const idx = zref.current.findIndex((z) => z.id === id)
      if (idx === -1) return
      zref.current = zref.current.filter((z) => z.id !== id)
      zappedRef.current += 1
      setZapped(zappedRef.current)
      setZombies([...zref.current])

      if (zappedRef.current >= WAVES[waveIdxRef.current]) {
        // wave cleared
        betweenRef.current = true
        waveIdxRef.current += 1
        if (waveIdxRef.current >= WAVES.length) {
          const t = setTimeout(() => m.win(), 500)
          timers.current.push(t)
        } else {
          setBetween(`Wave cleared! Next: for zombie in range(${WAVES[waveIdxRef.current]})`)
          const t = setTimeout(() => startWave(waveIdxRef.current), 1300)
          timers.current.push(t)
        }
      }
    },
    [m, startWave]
  )

  useRaf((dt) => {
    if (betweenRef.current) return
    let breached = false
    for (const z of zref.current) {
      z.y += z.speed * dt
      if (z.y >= 88) breached = true
    }
    if (breached) {
      m.lose()
      return
    }
    setZombies([...zref.current])
  }, m.status === 'playing')

  const waveSize = WAVES[Math.min(waveIdxRef.current, WAVES.length - 1)]

  return (
    <GameShell
      title="Zombie Forest — Clear the Wave"
      accent={level.accent}
      howTo={[
        'Each wave has a fixed number of zombies — like range(5).',
        'Tap every zombie to zap it. Repeat the SAME action for each one.',
        'Clear all zombies before any reaches the bottom.',
        'Survive all 3 waves to escape the forest! 🌙',
      ]}
      status={m.status}
      score={
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <span className="rounded-full bg-white/10 px-2.5 py-1">Wave {waveNum}/{WAVES.length}</span>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 font-mono text-emerald-200">
            {zapped}/{waveSize} zapped
          </span>
        </div>
      }
      onStart={m.start}
      onBeginPlay={beginPlay}
      onPause={m.pause}
      onResume={m.resume}
      onRestart={m.restart}
      onContinue={onComplete}
      winTitle="You Survived! 🌙"
      winText="You repeated your zap for every zombie in every wave — that's a FOR loop!"
      loseTitle="Overrun! 🧟"
      loseText="A zombie slipped through. Zap faster and clear the whole wave!"
      fieldClassName="min-h-[490px] bg-gradient-to-b from-lime-900/50 to-emerald-950/80"
    >
      <div className="relative min-h-[490px] overflow-hidden">
        {/* forest deco */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-around text-3xl opacity-40">
          <span>🌲</span>
          <span>🌳</span>
          <span>🌲</span>
          <span>🌳</span>
          <span>🌲</span>
        </div>

        {/* loop label */}
        <div className="absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 font-mono text-xs font-bold text-lime-200">
          for zombie in range({waveSize}):
        </div>

        {/* zombies */}
        <AnimatePresence>
          {zombies.map((z) => (
            <motion.button
              key={z.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 select-none text-4xl"
              style={{ left: `${z.x}%`, top: `${z.y}%` }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.6, opacity: 0, rotate: 30 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => zap(z.id)}
            >
              🧟
            </motion.button>
          ))}
        </AnimatePresence>

        {/* between-wave message */}
        <AnimatePresence>
          {between && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-emerald-500/90 px-5 py-3 text-center font-display font-bold text-white shadow-glow"
            >
              {between}
            </motion.div>
          )}
        </AnimatePresence>

        {/* player at bottom */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-5xl">🧝‍♀️</div>
        {/* danger line */}
        <div className="absolute inset-x-0 bottom-[12%] border-t-2 border-dashed border-rose-400/40" />
      </div>
    </GameShell>
  )
}
