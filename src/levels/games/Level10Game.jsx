import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/game/GameShell.jsx'
import useGameMachine from '../../components/game/useGameMachine.js'
import useRaf, { useKeys } from '../../components/game/useRaf.js'

const TARGET = 100
const K = 1.15 // distance units -> screen percent
const PLAYER_X = 28

export default function Level10Game({ level, onComplete }) {
  const m = useGameMachine()
  const [hud, setHud] = useState({ dist: 0, boulder: -9, stamina: 100 })
  const [orbs, setOrbs] = useState([
    { d: 22, got: false },
    { d: 45, got: false },
    { d: 68, got: false },
    { d: 88, got: false },
  ])
  const s = useRef({ dist: 0, boulder: -9, stamina: 100 })
  const orbsRef = useRef([])
  const running = useRef(false)
  const keys = useKeys(m.status === 'playing')

  const reset = useCallback(() => {
    s.current = { dist: 0, boulder: -9, stamina: 100 }
    orbsRef.current = [
      { d: 22, got: false },
      { d: 45, got: false },
      { d: 68, got: false },
      { d: 88, got: false },
    ]
    running.current = false
    setHud({ dist: 0, boulder: -9, stamina: 100 })
    setOrbs(orbsRef.current.map((o) => ({ ...o })))
  }, [])

  useEffect(() => reset(), [m.runId, reset])

  useRaf((dt) => {
    const st = s.current
    const run = running.current || keys.current.has(' ') || keys.current.has('ArrowRight')

    if (run && st.stamina > 0) {
      st.dist += 14 * dt
      st.stamina = Math.max(0, st.stamina - 8 * dt)
    }
    // boulder always advances
    st.boulder += 9 * dt

    // collect orbs
    let changed = false
    for (const o of orbsRef.current) {
      if (!o.got && st.dist >= o.d) {
        o.got = true
        st.stamina = Math.min(100, st.stamina + 28)
        changed = true
      }
    }
    if (changed) setOrbs(orbsRef.current.map((o) => ({ ...o })))

    // lose conditions
    if (st.boulder >= st.dist) {
      setHud({ ...st })
      m.lose()
      return
    }
    if (st.stamina <= 0 && st.dist < TARGET) {
      // exhausted — boulder will catch; end now
      setHud({ ...st })
      m.lose()
      return
    }
    if (st.dist >= TARGET) {
      setHud({ dist: TARGET, boulder: st.boulder, stamina: st.stamina })
      m.win()
      return
    }
    setHud({ ...st })
  }, m.status === 'playing')

  const boulderScreen = PLAYER_X - (hud.dist - hud.boulder) * K
  const exitScreen = PLAYER_X + (TARGET - hud.dist) * K
  const staminaColor = hud.stamina > 40 ? 'bg-emerald-400' : hud.stamina > 15 ? 'bg-amber-400' : 'bg-rose-400'

  return (
    <GameShell
      title="Temple Escape — Run While You Can"
      accent={level.accent}
      howTo={[
        'Hold RUN (or Space / →) to keep running toward the exit 🚪.',
        'Running uses stamina. WHILE your stamina is above 0, you can move.',
        'Grab energy orbs ⚡ to refill. A boulder 🪨 is rolling right behind you!',
        'Reach the exit before stamina hits 0 or the boulder catches you.',
      ]}
      status={m.status}
      score={
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <span className="rounded-full bg-white/10 px-2.5 py-1">{Math.round((hud.dist / TARGET) * 100)}% 🚪</span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono">stamina {Math.round(hud.stamina)}</span>
        </div>
      }
      onStart={m.start}
      onBeginPlay={m.beginPlay}
      onPause={m.pause}
      onResume={m.resume}
      onRestart={m.restart}
      onContinue={onComplete}
      winTitle="Escaped the Temple! 🏛️"
      winText="You kept running while your stamina lasted and reached the exit — that's a WHILE loop!"
      loseTitle="Caught!"
      loseText="Your stamina ran out and the boulder caught you. Grab those energy orbs and keep moving!"
      fieldClassName="min-h-[490px] bg-gradient-to-b from-amber-900/50 to-stone-950/80"
    >
      <div className="relative min-h-[490px] overflow-hidden">
        {/* temple bg */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #78716c 0 60px, #57534e 60px 62px), repeating-linear-gradient(#78716c 0 40px, #57534e 40px 42px)',
          }}
        />

        {/* while-loop label */}
        <div className="absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 font-mono text-xs font-bold text-amber-200">
          while stamina &gt; 0: run() &nbsp;|&nbsp; stamina = {Math.round(hud.stamina)}
        </div>

        {/* ground */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-stone-700 to-stone-900" />

        {/* boulder */}
        {boulderScreen > -12 && (
          <motion.div
            className="absolute bottom-24 z-10 text-5xl"
            style={{ left: `${boulderScreen}%` }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          >
            🪨
          </motion.div>
        )}

        {/* orbs */}
        {orbs.map(
          (o, i) =>
            !o.got && (
              <motion.div
                key={i}
                className="absolute bottom-28 z-10 text-3xl"
                style={{ left: `${PLAYER_X + (o.d - hud.dist) * K}%` }}
                animate={{ y: [0, -10, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                ⚡
              </motion.div>
            )
        )}

        {/* exit */}
        {exitScreen < 112 && (
          <div className="absolute bottom-24 z-10 text-5xl" style={{ left: `${exitScreen}%` }}>
            🚪
          </div>
        )}

        {/* player */}
        <motion.div
          className="absolute bottom-24 z-20 text-5xl"
          style={{ left: `${PLAYER_X}%` }}
          animate={running.current ? { y: [0, -6, 0] } : { y: 0 }}
          transition={{ duration: 0.35, repeat: running.current ? Infinity : 0 }}
        >
          🏃‍♀️
        </motion.div>

        {/* stamina bar */}
        <div className="absolute inset-x-4 top-12 z-20">
          <div className="mb-1 text-[10px] font-bold text-slate-300">Stamina</div>
          <div className="h-3 overflow-hidden rounded-full bg-black/30">
            <div className={`h-full rounded-full transition-all ${staminaColor}`} style={{ width: `${hud.stamina}%` }} />
          </div>
        </div>

        {/* RUN button */}
        <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center px-6">
          <button
            onPointerDown={() => (running.current = true)}
            onPointerUp={() => (running.current = false)}
            onPointerLeave={() => (running.current = false)}
            className="no-select w-full max-w-xs select-none rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 font-display text-lg font-extrabold text-white shadow-card active:scale-95"
          >
            🏃 HOLD TO RUN
          </button>
        </div>
      </div>
    </GameShell>
  )
}
