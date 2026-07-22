import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/game/GameShell.jsx'
import useGameMachine from '../../components/game/useGameMachine.js'
import useRaf, { useKeys } from '../../components/game/useRaf.js'

const TARGET = 12
const OBSTACLES = ['🚧', '🪨', '🛢️', '🐢']

export default function Level7Game({ level, onComplete }) {
  const m = useGameMachine()
  const [lane, setLane] = useState(0)
  const [obstacles, setObstacles] = useState([])
  const [dodged, setDodged] = useState(0)
  const laneRef = useRef(0)
  const obsRef = useRef([])
  const idRef = useRef(0)
  const spawnRef = useRef(1.1)
  const speedRef = useRef(42)
  const dodgedRef = useRef(0)
  const keys = useKeys(m.status === 'playing')
  const prevKeys = useRef({ left: false, right: false })

  const reset = useCallback(() => {
    laneRef.current = 0
    obsRef.current = []
    idRef.current = 0
    spawnRef.current = 1.1
    speedRef.current = 42
    dodgedRef.current = 0
    setLane(0)
    setObstacles([])
    setDodged(0)
  }, [])

  useEffect(() => reset(), [m.runId, reset])

  const switchLane = useCallback((to) => {
    laneRef.current = to
    setLane(to)
  }, [])

  useRaf((dt) => {
    // keyboard edge detection
    const left = keys.current.has('ArrowLeft') || keys.current.has('a')
    const right = keys.current.has('ArrowRight') || keys.current.has('d')
    if (left && !prevKeys.current.left) switchLane(0)
    if (right && !prevKeys.current.right) switchLane(1)
    prevKeys.current = { left, right }

    // spawn
    spawnRef.current -= dt
    if (spawnRef.current <= 0) {
      idRef.current += 1
      const lane = Math.random() < 0.5 ? 0 : 1
      obsRef.current.push({
        id: idRef.current,
        lane,
        y: -12,
        emoji: OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)],
      })
      spawnRef.current = Math.max(0.62, 1.15 - dodgedRef.current * 0.04)
    }

    // move + collisions
    const speed = speedRef.current + dodgedRef.current * 1.4
    let crashed = false
    const survivors = []
    for (const o of obsRef.current) {
      o.y += speed * dt
      if (o.y >= 82 && o.y <= 94) {
        if (o.lane === laneRef.current) {
          crashed = true
        }
      }
      if (o.y >= 100) {
        dodgedRef.current += 1
      } else {
        survivors.push(o)
      }
    }
    obsRef.current = survivors

    if (crashed) {
      setObstacles([...obsRef.current])
      m.lose()
      return
    }
    setDodged(dodgedRef.current)
    setObstacles([...obsRef.current])

    if (dodgedRef.current >= TARGET) {
      m.win()
    }
  }, m.status === 'playing')

  const laneX = (l) => (l === 0 ? '30%' : '70%')

  return (
    <GameShell
      title="Highway Escape — Swerve or Stay"
      accent={level.accent}
      howTo={[
        'Your car is in one of two lanes.',
        'IF an obstacle is in your lane → swerve to the other lane.',
        'ELSE (lane is clear) → stay put.',
        'Use ← → arrows, the buttons, or tap a lane. Dodge 12 to win!',
      ]}
      status={m.status}
      score={
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
          Dodged {dodged}/{TARGET}
        </span>
      }
      onStart={m.start}
      onBeginPlay={m.beginPlay}
      onPause={m.pause}
      onResume={m.resume}
      onRestart={m.restart}
      onContinue={onComplete}
      winTitle="Escaped!"
      winText="You made every two-way choice perfectly and survived the highway!"
      loseTitle="Crash! 💥"
      loseText="An obstacle was in your lane. Remember: if blocked, swerve — else, stay!"
      fieldClassName="min-h-[490px] bg-gradient-to-b from-indigo-900/50 to-slate-900"
    >
      <div className="relative min-h-[490px] overflow-hidden">
        {/* road */}
        <div className="absolute inset-0 mx-auto w-[80%] max-w-lg bg-slate-800">
          <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-amber-300/40" />
          <div className="absolute inset-y-0 left-0 w-1.5 bg-white/20" />
          <div className="absolute inset-y-0 right-0 w-1.5 bg-white/20" />
        </div>

        {/* tap zones */}
        <button
          className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
          onClick={() => switchLane(0)}
          aria-label="Left lane"
        />
        <button
          className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
          onClick={() => switchLane(1)}
          aria-label="Right lane"
        />

        {/* obstacles */}
        {obstacles.map((o) => (
          <div
            key={o.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-4xl"
            style={{ left: laneX(o.lane), top: `${o.y}%` }}
          >
            {o.emoji}
          </div>
        ))}

        {/* car */}
        <motion.div
          className="absolute bottom-[10%] z-20 -translate-x-1/2 text-5xl"
          animate={{ left: laneX(lane) }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        >
          🏎️
        </motion.div>

        {/* buttons */}
        <div className="absolute inset-x-0 bottom-3 z-30 flex justify-between px-6">
          <button
            onClick={() => switchLane(0)}
            className={`no-select rounded-2xl px-6 py-3 font-display font-bold text-white shadow-card active:scale-95 ${
              lane === 0 ? 'bg-sky-500' : 'bg-white/15'
            }`}
          >
            ◀ Left
          </button>
          <button
            onClick={() => switchLane(1)}
            className={`no-select rounded-2xl px-6 py-3 font-display font-bold text-white shadow-card active:scale-95 ${
              lane === 1 ? 'bg-sky-500' : 'bg-white/15'
            }`}
          >
            Right ▶
          </button>
        </div>
      </div>
    </GameShell>
  )
}
