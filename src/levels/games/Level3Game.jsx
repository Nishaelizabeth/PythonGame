import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/game/GameShell.jsx'
import useGameMachine from '../../components/game/useGameMachine.js'
import useRaf from '../../components/game/useRaf.js'

const POOL = [
  { v: '"hello"', t: 'str' },
  { v: '"Elizabeth"', t: 'str' },
  { v: '"dragon"', t: 'str' },
  { v: '"42"', t: 'str' },
  { v: '7', t: 'int' },
  { v: '100', t: 'int' },
  { v: '3', t: 'int' },
  { v: '256', t: 'int' },
  { v: '3.14', t: 'float' },
  { v: '2.5', t: 'float' },
  { v: '0.99', t: 'float' },
  { v: '10.0', t: 'float' },
  { v: 'True', t: 'bool' },
  { v: 'False', t: 'bool' },
]

const BINS = [
  { t: 'str', label: 'String', emoji: '🔤', color: 'from-pink-500 to-rose-600', key: '1' },
  { t: 'int', label: 'Integer', emoji: '🔢', color: 'from-sky-500 to-blue-600', key: '2' },
  { t: 'float', label: 'Float', emoji: '🔵', color: 'from-violet-500 to-purple-600', key: '3' },
  { t: 'bool', label: 'Boolean', emoji: '✅', color: 'from-emerald-500 to-teal-600', key: '4' },
]

const TARGET = 8
const START_LIVES = 3

function pick(prev) {
  let c
  do {
    c = POOL[Math.floor(Math.random() * POOL.length)]
  } while (prev && c.v === prev)
  return c
}

export default function Level3Game({ level, onComplete }) {
  const m = useGameMachine()
  const [crystal, setCrystal] = useState(() => ({ ...pick(), x: 50, y: 0 }))
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(START_LIVES)
  const [flash, setFlash] = useState(null) // 'good' | 'bad'
  const yRef = useRef(0)
  const speedRef = useRef(16)
  const scoreRef = useRef(0)
  const livesRef = useRef(START_LIVES)

  const spawn = useCallback((prevV) => {
    const c = pick(prevV)
    yRef.current = 0
    setCrystal({ ...c, x: 18 + Math.random() * 64, y: 0 })
  }, [])

  const reset = useCallback(() => {
    scoreRef.current = 0
    livesRef.current = START_LIVES
    speedRef.current = 16
    setScore(0)
    setLives(START_LIVES)
    setFlash(null)
    spawn(null)
  }, [spawn])

  useEffect(() => {
    reset()
  }, [m.runId, reset])

  const loseLife = useCallback(() => {
    livesRef.current -= 1
    setLives(livesRef.current)
    setFlash('bad')
    setTimeout(() => setFlash(null), 250)
    if (livesRef.current <= 0) {
      m.lose()
    } else {
      spawn(crystal.v)
    }
  }, [crystal.v, m, spawn])

  // falling loop
  useRaf((dt) => {
    yRef.current += speedRef.current * dt
    if (yRef.current >= 88) {
      loseLife()
      return
    }
    setCrystal((c) => ({ ...c, y: yRef.current }))
  }, m.status === 'playing')

  const classify = useCallback(
    (binType) => {
      if (m.status !== 'playing') return
      if (binType === crystal.t) {
        scoreRef.current += 1
        setScore(scoreRef.current)
        speedRef.current = 16 + scoreRef.current * 1.6
        setFlash('good')
        setTimeout(() => setFlash(null), 200)
        if (scoreRef.current >= TARGET) {
          m.win()
        } else {
          spawn(crystal.v)
        }
      } else {
        loseLife()
      }
    },
    [crystal, m, spawn, loseLife]
  )

  // keyboard 1-4
  useEffect(() => {
    if (m.status !== 'playing') return
    const onKey = (e) => {
      const bin = BINS.find((b) => b.key === e.key)
      if (bin) classify(bin.t)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [classify, m.status])

  return (
    <GameShell
      title="Data Type Mountain — Sort the Crystals"
      accent={level.accent}
      howTo={[
        'Magic crystals fall from the peak — each holds a value.',
        'Tap the bin that matches its TYPE before it lands.',
        'String = quotes, Integer = whole number, Float = decimal, Boolean = True/False.',
        `Sort ${TARGET} correctly to win. You have ${START_LIVES} lives!`,
      ]}
      status={m.status}
      score={
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <span className="rounded-full bg-white/10 px-2.5 py-1">
            {score}/{TARGET}
          </span>
          <span className="rounded-full bg-rose-500/20 px-2.5 py-1 text-rose-200">
            {'❤️'.repeat(Math.max(0, lives))}
          </span>
        </div>
      }
      onStart={m.start}
      onBeginPlay={m.beginPlay}
      onPause={m.pause}
      onResume={m.resume}
      onRestart={m.restart}
      onContinue={onComplete}
      winTitle="Master Sorter!"
      winText="You sorted every crystal by its data type. The mountain glows with thanks!"
      loseText="The crystals piled up! Watch the type closely and try again."
      fieldClassName={`min-h-[480px] transition-colors ${
        flash === 'good'
          ? 'bg-emerald-700/40'
          : flash === 'bad'
          ? 'bg-rose-800/40'
          : 'bg-gradient-to-b from-indigo-800/40 to-slate-900/60'
      }`}
    >
      <div className="relative min-h-[480px]">
        {/* mountain silhouette */}
        <div className="pointer-events-none absolute inset-x-0 top-0 text-center text-5xl opacity-30">
          ⛰️
        </div>

        {/* falling crystal */}
        <AnimatePresence>
          {(m.status === 'playing' || m.status === 'paused') && (
            <motion.div
              key={crystal.v + crystal.x}
              className="absolute z-10 -translate-x-1/2"
              style={{ left: `${crystal.x}%`, top: `${crystal.y}%` }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="grid place-items-center rounded-2xl border-2 border-white/40 bg-gradient-to-br from-white/25 to-white/5 px-4 py-3 shadow-glow backdrop-blur">
                <span className="text-2xl">💎</span>
                <span className="mt-0.5 font-mono text-lg font-extrabold text-white">
                  {crystal.v}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* bins */}
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-4 gap-2 p-3">
          {BINS.map((b) => (
            <motion.button
              key={b.t}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => classify(b.t)}
              className={`flex flex-col items-center rounded-2xl border-2 border-white/20 bg-gradient-to-br ${b.color} px-1 py-3 font-bold text-white shadow-card`}
            >
              <span className="text-2xl">{b.emoji}</span>
              <span className="text-xs sm:text-sm">{b.label}</span>
              <span className="mt-0.5 hidden rounded bg-black/20 px-1.5 text-[10px] opacity-80 sm:inline">
                key {b.key}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </GameShell>
  )
}
