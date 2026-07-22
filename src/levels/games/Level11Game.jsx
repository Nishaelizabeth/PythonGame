import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/game/GameShell.jsx'
import useGameMachine from '../../components/game/useGameMachine.js'
import useRaf, { useKeys } from '../../components/game/useRaf.js'

const TREASURES = [
  { id: 't1', name: 'gold', emoji: '💰', x: 20, y: 30 },
  { id: 't2', name: 'gem', emoji: '💎', x: 75, y: 22 },
  { id: 't3', name: 'crown', emoji: '👑', x: 82, y: 66 },
  { id: 't4', name: 'map', emoji: '🗺️', x: 30, y: 72 },
  { id: 't5', name: 'ring', emoji: '💍', x: 52, y: 46 },
]

export default function Level11Game({ level, onComplete }) {
  const m = useGameMachine()
  const [pos, setPos] = useState({ x: 50, y: 88 })
  const [inventory, setInventory] = useState([]) // array of {name, emoji}
  const posRef = useRef({ x: 50, y: 88 })
  const invRef = useRef([])
  const gotRef = useRef(new Set())
  const dir = useRef({ x: 0, y: 0 })
  const keys = useKeys(m.status === 'playing')
  const [treasures, setTreasures] = useState(TREASURES.map((t) => ({ ...t, got: false })))

  const reset = useCallback(() => {
    posRef.current = { x: 50, y: 88 }
    invRef.current = []
    gotRef.current = new Set()
    dir.current = { x: 0, y: 0 }
    setPos({ x: 50, y: 88 })
    setInventory([])
    setTreasures(TREASURES.map((t) => ({ ...t, got: false })))
  }, [])

  useEffect(() => reset(), [m.runId, reset])

  useRaf((dt) => {
    let dx = dir.current.x
    let dy = dir.current.y
    if (keys.current.has('ArrowLeft') || keys.current.has('a')) dx -= 1
    if (keys.current.has('ArrowRight') || keys.current.has('d')) dx += 1
    if (keys.current.has('ArrowUp') || keys.current.has('w')) dy -= 1
    if (keys.current.has('ArrowDown') || keys.current.has('s')) dy += 1
    // normalize
    const len = Math.hypot(dx, dy) || 1
    const speed = 46
    const p = posRef.current
    p.x = Math.max(4, Math.min(96, p.x + (dx / len) * speed * dt))
    p.y = Math.max(8, Math.min(92, p.y + (dy / len) * speed * dt))

    // collect
    let collected = false
    for (const t of TREASURES) {
      if (!gotRef.current.has(t.id) && Math.hypot(p.x - t.x, p.y - t.y) < 7) {
        gotRef.current.add(t.id)
        invRef.current.push({ name: t.name, emoji: t.emoji })
        collected = true
      }
    }
    if (collected) {
      setInventory([...invRef.current])
      setTreasures(TREASURES.map((t) => ({ ...t, got: gotRef.current.has(t.id) })))
    }

    setPos({ x: p.x, y: p.y })

    if (invRef.current.length >= TREASURES.length) {
      m.win()
    }
  }, m.status === 'playing')

  const setDir = (x, y) => (dir.current = { x, y })
  const clearDir = () => (dir.current = { x: 0, y: 0 })

  const DPad = () => (
    <div className="grid grid-cols-3 grid-rows-3 gap-1">
      <span />
      <button
        onPointerDown={() => setDir(0, -1)}
        onPointerUp={clearDir}
        onPointerLeave={clearDir}
        className="grid h-11 place-items-center rounded-xl bg-white/15 text-white active:bg-white/30"
      >
        ▲
      </button>
      <span />
      <button
        onPointerDown={() => setDir(-1, 0)}
        onPointerUp={clearDir}
        onPointerLeave={clearDir}
        className="grid h-11 place-items-center rounded-xl bg-white/15 text-white active:bg-white/30"
      >
        ◀
      </button>
      <span className="grid place-items-center text-xs text-slate-400">move</span>
      <button
        onPointerDown={() => setDir(1, 0)}
        onPointerUp={clearDir}
        onPointerLeave={clearDir}
        className="grid h-11 place-items-center rounded-xl bg-white/15 text-white active:bg-white/30"
      >
        ▶
      </button>
      <span />
      <button
        onPointerDown={() => setDir(0, 1)}
        onPointerUp={clearDir}
        onPointerLeave={clearDir}
        className="grid h-11 place-items-center rounded-xl bg-white/15 text-white active:bg-white/30"
      >
        ▼
      </button>
      <span />
    </div>
  )

  return (
    <GameShell
      title="Treasure Island — Fill Your Inventory List"
      accent={level.accent}
      howTo={[
        'Move your explorer with arrow keys, WASD, or the on-screen pad.',
        'Walk over each treasure to add it to your inventory LIST.',
        'Watch the list grow — each item gets an index, starting at 0!',
        'Collect all 5 treasures to complete your list.',
      ]}
      status={m.status}
      score={
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
          {inventory.length}/{TREASURES.length} collected
        </span>
      }
      onStart={m.start}
      onBeginPlay={m.beginPlay}
      onPause={m.pause}
      onResume={m.resume}
      onRestart={m.restart}
      onContinue={onComplete}
      winTitle="Full Inventory! 🏝️"
      winText="Every treasure is stored in your list, each with its own index. That's a Python list!"
      fieldClassName="min-h-[490px] bg-gradient-to-b from-teal-700/50 to-sky-950/70"
    >
      <div className="grid min-h-[490px] gap-3 p-3 lg:grid-cols-[1.4fr_1fr]">
        {/* Beach field */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-amber-200/20 via-teal-500/10 to-sky-700/20">
          {/* water top / sand */}
          <div className="absolute inset-x-0 top-0 h-1/4 bg-sky-500/20" />
          <div className="pointer-events-none absolute right-3 top-2 text-2xl opacity-70">🌴</div>
          <div className="pointer-events-none absolute left-4 top-3 text-xl opacity-60">⛅</div>

          {/* treasures */}
          {treasures.map(
            (t) =>
              !t.got && (
                <motion.div
                  key={t.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl"
                  style={{ left: `${t.x}%`, top: `${t.y}%` }}
                  animate={{ y: [0, -6, 0], rotate: [0, 6, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {t.emoji}
                </motion.div>
              )
          )}

          {/* player */}
          <motion.div
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-3xl"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            🧭
          </motion.div>
        </div>

        {/* Inventory + controls */}
        <div className="flex flex-col">
          <div className="rounded-2xl border border-white/10 bg-[#0c1024] p-3">
            <div className="mb-2 font-mono text-xs text-slate-400">treasures = [</div>
            <div className="min-h-[120px] space-y-1.5 pl-3">
              <AnimatePresence>
                {inventory.map((it, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 font-mono text-sm"
                  >
                    <span className="rounded bg-white/10 px-1.5 text-[10px] font-bold text-quest-gold">
                      [{i}]
                    </span>
                    <span className="text-emerald-300">&quot;{it.name}&quot;</span>
                    <span>{it.emoji}</span>
                    {i < inventory.length - 1 && <span className="text-slate-500">,</span>}
                  </motion.div>
                ))}
              </AnimatePresence>
              {inventory.length === 0 && (
                <div className="font-mono text-xs text-slate-600">// empty — go collect!</div>
              )}
            </div>
            <div className="mt-1 font-mono text-xs text-slate-400">]</div>
            <div className="mt-2 border-t border-white/10 pt-2 font-mono text-xs text-slate-300">
              len(treasures) = <span className="text-amber-300">{inventory.length}</span>
            </div>
          </div>

          <div className="mt-auto flex justify-center pt-3">
            <DPad />
          </div>
        </div>
      </div>
    </GameShell>
  )
}
