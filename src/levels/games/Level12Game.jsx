import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/game/GameShell.jsx'
import useGameMachine from '../../components/game/useGameMachine.js'

const MAX_HP = 40

export default function Level12Game({ level, onComplete }) {
  const m = useGameMachine()
  const [arg, setArg] = useState(5)
  const [hp, setHp] = useState(MAX_HP)
  const [log, setLog] = useState([])
  const [hit, setHit] = useState(false)
  const [casts, setCasts] = useState(0)
  const hpRef = useRef(MAX_HP)
  const logEnd = useRef(null)

  const reset = useCallback(() => {
    hpRef.current = MAX_HP
    setArg(5)
    setHp(MAX_HP)
    setLog([])
    setHit(false)
    setCasts(0)
  }, [])

  useEffect(() => reset(), [m.runId, reset])
  useEffect(() => {
    if (logEnd.current) logEnd.current.scrollTop = logEnd.current.scrollHeight
  }, [log])

  const cast = () => {
    if (m.status !== 'playing' || hpRef.current <= 0) return
    const dmg = arg * 2
    hpRef.current = Math.max(0, hpRef.current - dmg)
    setHp(hpRef.current)
    setCasts((c) => c + 1)
    setLog((l) => [
      ...l,
      { call: `cast_spell(${arg})`, trace: `return ${arg} * 2  →  ${dmg}`, dmg },
    ])
    setHit(true)
    setTimeout(() => setHit(false), 300)
    if (hpRef.current <= 0) {
      setTimeout(() => m.win(), 700)
    }
  }

  const hpPct = (hp / MAX_HP) * 100

  return (
    <GameShell
      title="Wizard Academy — Cast Your Spell Function"
      accent={level.accent}
      howTo={[
        'Your spell is a FUNCTION: def cast_spell(power): return power * 2',
        'Choose an argument (a power value), then press CAST.',
        'The function RETURNS power × 2 as damage — reuse it as many times as you like!',
        'Defeat the practice dragon to graduate as a Grand Wizard! 🎓',
      ]}
      status={m.status}
      score={
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <span className="rounded-full bg-white/10 px-2.5 py-1">Casts: {casts}</span>
          <span className="rounded-full bg-rose-500/20 px-2.5 py-1 text-rose-200">HP {hp}/{MAX_HP}</span>
        </div>
      }
      onStart={m.start}
      onBeginPlay={m.beginPlay}
      onPause={m.pause}
      onResume={m.resume}
      onRestart={m.restart}
      onContinue={onComplete}
      winTitle="Grand Wizard! 🎓"
      winText="You defined a spell once and cast it again and again with different arguments — that's the power of functions!"
      fieldClassName="min-h-[490px] bg-gradient-to-b from-fuchsia-900/50 to-indigo-950/80"
    >
      <div className="grid min-h-[490px] gap-4 p-4 lg:grid-cols-[1fr_1fr]">
        {/* Battle side */}
        <div className="flex flex-col items-center">
          {/* dragon */}
          <div className="relative mt-2 grid place-items-center">
            <motion.div
              className="text-8xl"
              animate={hit ? { x: [0, -10, 10, -6, 0], scale: [1, 0.92, 1] } : { y: [0, -8, 0] }}
              transition={hit ? { duration: 0.3 } : { duration: 3, repeat: Infinity }}
            >
              🐉
            </motion.div>
            <AnimatePresence>
              {hit && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, y: -30, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-2 font-display text-2xl font-extrabold text-quest-gold"
                >
                  -{arg * 2}!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* HP bar */}
          <div className="mt-3 w-full max-w-xs">
            <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-300">
              <span>Practice Dragon</span>
              <span>{hp} HP</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-black/40">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600"
                animate={{ width: `${hpPct}%` }}
              />
            </div>
          </div>

          {/* Wizard */}
          <div className="mt-4 text-5xl">🧙‍♀️</div>
        </div>

        {/* Function builder side */}
        <div className="flex flex-col">
          {/* definition */}
          <div className="rounded-2xl border border-white/10 bg-[#0c1024] p-3 font-mono text-sm">
            <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">your function</div>
            <div>
              <span className="text-fuchsia-300 font-bold">def</span>{' '}
              <span className="text-sky-300">cast_spell</span>
              <span className="text-slate-300">(</span>
              <span className="text-amber-300" title="parameter">power</span>
              <span className="text-slate-300">):</span>
            </div>
            <div className="pl-6">
              <span className="text-fuchsia-300 font-bold">return</span>{' '}
              <span className="text-amber-300">power</span> <span className="text-sky-300">*</span>{' '}
              <span className="text-amber-300">2</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-500">
              <span className="text-amber-300">power</span> is the <b>parameter</b> (the ingredient name)
            </div>
          </div>

          {/* argument picker */}
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 text-sm font-bold text-white">
              Pick the <span className="text-quest-gold">argument</span> (the real power value):
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setArg((a) => Math.max(1, a - 1))}
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-2xl font-bold text-white active:scale-95"
              >
                −
              </button>
              <div className="grid h-16 w-20 place-items-center rounded-2xl bg-fuchsia-500/20 font-mono text-3xl font-extrabold text-white">
                {arg}
              </div>
              <button
                onClick={() => setArg((a) => Math.min(10, a + 1))}
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-2xl font-bold text-white active:scale-95"
              >
                +
              </button>
            </div>
            <div className="mt-2 text-center font-mono text-xs text-slate-300">
              cast_spell(<span className="text-quest-gold">{arg}</span>) → returns{' '}
              <span className="text-emerald-300">{arg * 2}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={cast}
              disabled={hp <= 0}
              className="btn-glow mt-3 w-full disabled:opacity-50"
            >
              🪄 CAST SPELL
            </motion.button>
          </div>

          {/* call log */}
          <div
            ref={logEnd}
            className="mt-3 max-h-28 flex-1 space-y-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/20 p-2 font-mono text-xs"
          >
            {log.length === 0 ? (
              <div className="text-slate-600">// your spell casts will appear here…</div>
            ) : (
              log.map((e, i) => (
                <div key={i} className="text-slate-200">
                  <span className="text-sky-300">&gt;&gt;&gt;</span> {e.call}{' '}
                  <span className="text-slate-500">→ {e.trace} → 🐉 -{e.dmg}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </GameShell>
  )
}
