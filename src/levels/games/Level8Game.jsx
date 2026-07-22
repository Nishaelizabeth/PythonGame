import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/game/GameShell.jsx'
import useGameMachine from '../../components/game/useGameMachine.js'
import useRaf from '../../components/game/useRaf.js'

const GOALS_TO_WIN = 3
const SHOTS = 5

export default function Level8Game({ level, onComplete }) {
  const m = useGameMachine()
  const [power, setPower] = useState(0)
  const [phase, setPhase] = useState('aim') // aim | result
  const [result, setResult] = useState(null) // miss | save | goal
  const [goals, setGoals] = useState(0)
  const [shotsUsed, setShotsUsed] = useState(0)
  const powerRef = useRef(0)
  const dirRef = useRef(1)
  const goalsRef = useRef(0)
  const shotsRef = useRef(0)

  const reset = useCallback(() => {
    powerRef.current = 0
    dirRef.current = 1
    goalsRef.current = 0
    shotsRef.current = 0
    setPower(0)
    setPhase('aim')
    setResult(null)
    setGoals(0)
    setShotsUsed(0)
  }, [])

  useEffect(() => reset(), [m.runId, reset])

  useRaf((dt) => {
    let p = powerRef.current + dirRef.current * 95 * dt
    if (p >= 100) {
      p = 100
      dirRef.current = -1
    } else if (p <= 0) {
      p = 0
      dirRef.current = 1
    }
    powerRef.current = p
    setPower(p)
  }, m.status === 'playing' && phase === 'aim')

  const shoot = useCallback(() => {
    if (m.status !== 'playing' || phase !== 'aim') return
    const p = powerRef.current
    let res = 'goal'
    if (p < 30) res = 'miss'
    else if (p < 70) res = 'save'
    else res = 'goal'

    setResult(res)
    setPhase('result')

    setTimeout(() => {
      shotsRef.current += 1
      if (res === 'goal') goalsRef.current += 1
      setGoals(goalsRef.current)
      setShotsUsed(shotsRef.current)

      if (goalsRef.current >= GOALS_TO_WIN) {
        m.win()
        return
      }
      if (shotsRef.current >= SHOTS) {
        m.lose()
        return
      }
      // next shot
      powerRef.current = 0
      dirRef.current = 1
      setPower(0)
      setResult(null)
      setPhase('aim')
    }, 1500)
  }, [m, phase])

  // ball target based on result
  const ballAnim =
    phase !== 'result'
      ? { bottom: '12%', left: '50%', scale: 1 }
      : result === 'goal'
      ? { bottom: '78%', left: '50%', scale: 0.7 }
      : result === 'save'
      ? { bottom: '64%', left: '50%', scale: 0.85 }
      : { bottom: '55%', left: '18%', scale: 0.8 }

  return (
    <GameShell
      title="Football Championship — The Winning Kick"
      accent={level.accent}
      howTo={[
        'The power bar swings back and forth. Press SHOOT to lock your power.',
        'Power under 30 → Miss. Between 30–69 → Keeper saves. 70 or more → GOAL!',
        'It checks each condition in order and stops at the first that matches.',
        `Score ${GOALS_TO_WIN} goals in ${SHOTS} shots to win the cup! 🏆`,
      ]}
      status={m.status}
      score={
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-emerald-200">
            ⚽ {goals}/{GOALS_TO_WIN}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1">Shots {shotsUsed}/{SHOTS}</span>
        </div>
      }
      onStart={m.start}
      onBeginPlay={m.beginPlay}
      onPause={m.pause}
      onResume={m.resume}
      onRestart={m.restart}
      onContinue={onComplete}
      winTitle="CHAMPIONS! 🏆"
      winText="You picked the perfect power and scored the winning goals!"
      loseTitle="So Close!"
      loseText="You ran out of shots. Aim for 70+ power to score a goal — try again!"
      fieldClassName="min-h-[490px] bg-gradient-to-b from-green-600/50 to-emerald-900/70"
    >
      <div className="relative min-h-[490px] overflow-hidden">
        {/* pitch stripes */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(to bottom, #16a34a 0 40px, #15803d 40px 80px)',
          }}
        />

        {/* goal */}
        <div className="absolute left-1/2 top-4 -translate-x-1/2">
          <div className="relative h-16 w-56 rounded-t-lg border-4 border-b-0 border-white/80 bg-white/5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(#ffffff33 1px, transparent 1px), linear-gradient(90deg, #ffffff33 1px, transparent 1px)',
                backgroundSize: '12px 12px',
              }}
            />
            {/* keeper */}
            <motion.div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-3xl"
              animate={
                phase === 'result' && result === 'save'
                  ? { scale: [1, 1.3, 1], y: [0, -6, 0] }
                  : { x: [-30, 30, -30] }
              }
              transition={
                phase === 'result' && result === 'save'
                  ? { duration: 0.5 }
                  : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              🧤
            </motion.div>
          </div>
        </div>

        {/* result banner */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 top-1/3 z-20 -translate-x-1/2"
            >
              <div
                className={`rounded-2xl px-5 py-2 font-display text-2xl font-extrabold text-white shadow-glow ${
                  result === 'goal'
                    ? 'bg-emerald-500'
                    : result === 'save'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              >
                {result === 'goal' ? 'GOAL! ⚽🥅' : result === 'save' ? 'SAVED! 🧤' : 'MISS! 😢'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ball */}
        <motion.div
          className="absolute z-10 -translate-x-1/2 text-4xl"
          animate={ballAnim}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        >
          ⚽
        </motion.div>

        {/* power meter + shoot */}
        <div className="absolute inset-x-0 bottom-4 z-30 px-5">
          <div className="mb-1 flex justify-between text-[10px] font-bold">
            <span className="text-rose-300">0 Miss</span>
            <span className="text-amber-300">30 Save</span>
            <span className="text-emerald-300">70 GOAL</span>
            <span className="text-white">100</span>
          </div>
          <div className="relative h-5 overflow-hidden rounded-full bg-black/30">
            <div className="absolute inset-y-0 left-0 bg-rose-500/60" style={{ width: '30%' }} />
            <div className="absolute inset-y-0 bg-amber-500/60" style={{ left: '30%', width: '40%' }} />
            <div className="absolute inset-y-0 right-0 bg-emerald-500/60" style={{ width: '30%' }} />
            {/* marker */}
            <div
              className="absolute top-0 h-full w-1.5 -translate-x-1/2 bg-white shadow-glow"
              style={{ left: `${power}%` }}
            />
          </div>
          <div className="mt-1 text-center font-mono text-sm font-bold text-white">
            power = {Math.round(power)}
          </div>
          <motion.button
            whileHover={{ scale: phase === 'aim' ? 1.03 : 1 }}
            whileTap={{ scale: 0.96 }}
            onClick={shoot}
            disabled={phase !== 'aim'}
            className="btn-glow mt-2 w-full disabled:opacity-50"
          >
            {phase === 'aim' ? '⚽ SHOOT!' : '…'}
          </motion.button>
        </div>
      </div>
    </GameShell>
  )
}
