import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/game/GameShell.jsx'
import useGameMachine from '../../components/game/useGameMachine.js'
import useRaf, { useKeys } from '../../components/game/useRaf.js'

const LIMIT = 80
const TARGET = 100
const CATCH_TIME = 1.4

export default function Level6Game({ level, onComplete }) {
  const m = useGameMachine()
  const [hud, setHud] = useState({ speed: 0, distance: 0, over: false, chase: 0 })
  const state = useRef({ speed: 0, distance: 0, chase: 0 })
  const accel = useRef(false)
  const brake = useRef(false)
  const keys = useKeys(m.status === 'playing')

  const reset = useCallback(() => {
    state.current = { speed: 0, distance: 0, chase: 0 }
    accel.current = false
    brake.current = false
    setHud({ speed: 0, distance: 0, over: false, chase: 0 })
  }, [])

  useEffect(() => reset(), [m.runId, reset])

  useRaf((dt) => {
    const s = state.current
    const up = accel.current || keys.current.has('ArrowUp') || keys.current.has(' ')
    const down = brake.current || keys.current.has('ArrowDown')

    if (up) s.speed += 46 * dt
    else if (down) s.speed -= 72 * dt
    else s.speed -= 20 * dt
    s.speed = Math.max(0, Math.min(120, s.speed))

    s.distance += s.speed * dt * 0.06

    const over = s.speed > LIMIT
    if (over) s.chase += dt
    else s.chase = Math.max(0, s.chase - dt * 1.6)

    if (s.chase >= CATCH_TIME) {
      setHud({ speed: s.speed, distance: s.distance, over, chase: s.chase })
      m.lose()
      return
    }
    if (s.distance >= TARGET) {
      setHud({ speed: s.speed, distance: TARGET, over, chase: s.chase })
      m.win()
      return
    }
    setHud({ speed: s.speed, distance: s.distance, over, chase: s.chase })
  }, m.status === 'playing')

  const over = hud.over
  const pct = Math.min(100, (hud.distance / TARGET) * 100)
  const roadOffset = (hud.distance * 40) % 80

  return (
    <GameShell
      title="Traffic City — Mind the Speed Limit"
      accent={level.accent}
      howTo={[
        'Hold Accelerate (or ↑ / Space) to speed up, Brake (or ↓) to slow down.',
        `The speed limit is ${LIMIT}. Reach the 🏁 finish line to win.`,
        'IF your speed goes over the limit, the police start chasing!',
        'Stay under the limit and you are safe. Ready, set, drive!',
      ]}
      status={m.status}
      score={
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <span className={`rounded-full px-2.5 py-1 ${over ? 'bg-rose-500/30 text-rose-200' : 'bg-white/10'}`}>
            {Math.round(hud.speed)} km/h
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1">{Math.round(pct)}% 🏁</span>
        </div>
      }
      onStart={m.start}
      onBeginPlay={m.beginPlay}
      onPause={m.pause}
      onResume={m.resume}
      onRestart={m.restart}
      onContinue={onComplete}
      winTitle="You Made It!"
      winText="You reached the finish line without breaking the speed limit. Smooth driving!"
      loseTitle="Busted! 🚔"
      loseText="Your speed went over 80 and the police caught you. Keep it under the limit next time!"
      fieldClassName="min-h-[490px] bg-slate-900"
    >
      <div className="relative min-h-[490px] overflow-hidden">
        {/* Road */}
        <div className="absolute inset-x-0 bottom-0 top-0 mx-auto w-2/3 max-w-md bg-gradient-to-b from-slate-700 to-slate-800">
          {/* side lines */}
          <div className="absolute inset-y-0 left-0 w-1.5 bg-amber-300/70" />
          <div className="absolute inset-y-0 right-0 w-1.5 bg-amber-300/70" />
          {/* dashes */}
          <div
            className="absolute inset-y-[-80px] left-1/2 w-2 -translate-x-1/2"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, #fff 0 34px, transparent 34px 80px)',
              transform: `translateX(-50%) translateY(${roadOffset}px)`,
            }}
          />
        </div>

        {/* Limit sign */}
        <div className="absolute left-3 top-3 grid h-16 w-16 place-items-center rounded-full border-4 border-rose-500 bg-white text-center">
          <div className="leading-none">
            <div className="text-[8px] font-bold text-slate-500">LIMIT</div>
            <div className="text-xl font-extrabold text-slate-900">{LIMIT}</div>
          </div>
        </div>

        {/* Speedometer */}
        <div className="absolute right-3 top-3 w-36">
          <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-300">
            <span>0</span>
            <span className={over ? 'text-rose-300' : 'text-emerald-300'}>{LIMIT}</span>
            <span>120</span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
            <div className="absolute inset-y-0 bg-emerald-500/40" style={{ width: `${(LIMIT / 120) * 100}%` }} />
            <div className="absolute inset-y-0 right-0 bg-rose-500/40" style={{ width: `${(40 / 120) * 100}%` }} />
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full ${over ? 'bg-rose-400' : 'bg-emerald-400'}`}
              style={{ width: `${(hud.speed / 120) * 100}%` }}
            />
          </div>
        </div>

        {/* Police warning */}
        <AnimatePresence>
          {over && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 top-16 z-10 -translate-x-1/2 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.4, repeat: Infinity }}
                className="text-4xl"
              >
                🚔
              </motion.div>
              <div className="mt-1 rounded-full bg-rose-500/80 px-3 py-1 text-xs font-extrabold text-white">
                SLOW DOWN! ({Math.max(0, CATCH_TIME - hud.chase).toFixed(1)}s)
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Finish flag near top as you progress */}
        <div className="absolute left-1/2 -translate-x-1/2 text-2xl" style={{ top: `${8 + (1 - pct / 100) * 5}%` }}>
          🏁
        </div>

        {/* Car */}
        <motion.div
          className="absolute left-1/2 z-10 -translate-x-1/2 text-5xl"
          style={{ bottom: '14%' }}
          animate={{ x: over ? [0, -3, 3, -2, 2, 0] : 0, rotate: 0 }}
          transition={{ duration: 0.25, repeat: over ? Infinity : 0 }}
        >
          🚗
        </motion.div>

        {/* Progress bar */}
        <div className="absolute inset-x-4 bottom-3 z-10">
          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-between px-4">
          <button
            onPointerDown={() => (brake.current = true)}
            onPointerUp={() => (brake.current = false)}
            onPointerLeave={() => (brake.current = false)}
            className="no-select select-none rounded-2xl bg-rose-500/80 px-5 py-3 font-display font-bold text-white shadow-card active:scale-95"
          >
            🛑 Brake
          </button>
          <button
            onPointerDown={() => (accel.current = true)}
            onPointerUp={() => (accel.current = false)}
            onPointerLeave={() => (accel.current = false)}
            className="no-select select-none rounded-2xl bg-emerald-500/90 px-5 py-3 font-display font-bold text-white shadow-card active:scale-95"
          >
            Accelerate ⛽
          </button>
        </div>
      </div>
    </GameShell>
  )
}
