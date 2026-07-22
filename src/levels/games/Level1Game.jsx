import { useEffect, useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/game/GameShell.jsx'
import useGameMachine from '../../components/game/useGameMachine.js'

const W = 4
const H = 3
const START = { x: 0, y: 2, dir: 1 } // facing right
const BAKERY = { x: 3, y: 0 }
// dir: 0 up, 1 right, 2 down, 3 left
const DX = [0, 1, 0, -1]
const DY = [-1, 0, 1, 0]
const ARROW_ROT = { 0: -90, 1: 0, 2: 90, 3: 180 }
const DIR_LABEL = { 0: 'Up ⬆️', 1: 'Right ➡️', 2: 'Down ⬇️', 3: 'Left ⬅️' }

const BLOCKS = [
  { id: 'F', label: 'Move Forward', icon: '⬆️', color: 'from-emerald-500 to-teal-600' },
  { id: 'L', label: 'Turn Left', icon: '↺', color: 'from-sky-500 to-blue-600' },
  { id: 'R', label: 'Turn Right', icon: '↻', color: 'from-violet-500 to-purple-600' },
]

// Simulate the program without animating, so we can preview the path
// and final facing direction before the player presses Run.
function simulatePath(program) {
  let cur = { ...START }
  const path = [{ ...cur }]
  let outOfBounds = false
  let bump = null
  for (const instr of program) {
    if (instr === 'L') cur = { ...cur, dir: (cur.dir + 3) % 4 }
    else if (instr === 'R') cur = { ...cur, dir: (cur.dir + 1) % 4 }
    else {
      const nx = cur.x + DX[cur.dir]
      const ny = cur.y + DY[cur.dir]
      if (nx < 0 || nx >= W || ny < 0 || ny >= H) {
        outOfBounds = true
        bump = { x: nx, y: ny }
        break
      }
      cur = { ...cur, x: nx, y: ny }
    }
    path.push({ ...cur })
  }
  return { path, final: cur, outOfBounds, bump }
}

export default function Level1Game({ level, onComplete }) {
  const m = useGameMachine()
  const [program, setProgram] = useState([])
  const [robot, setRobot] = useState({ ...START })
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState('')
  const [bump, setBump] = useState(false)
  const timers = useRef([])

  // Live preview of where this program will lead, computed instantly
  // (no waiting for Run) so Beepo's turns and facing are never a surprise.
  const preview = useMemo(() => simulatePath(program), [program])

  const reset = () => {
    setProgram([])
    setRobot({ ...START })
    setRunning(false)
    setMessage('')
    setBump(false)
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  // reset when restarted
  useEffect(() => {
    reset()
  }, [m.runId])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const add = (id) => {
    if (running || program.length >= 10) return
    setProgram((p) => [...p, id])
  }
  const undo = () => !running && setProgram((p) => p.slice(0, -1))
  const clearAll = () => !running && setProgram([])

  const run = () => {
    if (running || program.length === 0) return
    setRunning(true)
    setMessage('')
    setBump(false)
    let cur = { ...START }
    setRobot({ ...cur })

    program.forEach((instr, i) => {
      const t = setTimeout(() => {
        if (instr === 'L') cur = { ...cur, dir: (cur.dir + 3) % 4 }
        else if (instr === 'R') cur = { ...cur, dir: (cur.dir + 1) % 4 }
        else {
          const nx = cur.x + DX[cur.dir]
          const ny = cur.y + DY[cur.dir]
          if (nx < 0 || nx >= W || ny < 0 || ny >= H) {
            setBump(true)
            setMessage('Bump! Beepo drove off the path. Fix the steps and try again.')
            setRobot({ ...cur })
            setRunning(false)
            timers.current.forEach(clearTimeout)
            return
          }
          cur = { ...cur, x: nx, y: ny }
        }
        setRobot({ ...cur })

        // reached bakery?
        if (cur.x === BAKERY.x && cur.y === BAKERY.y) {
          setMessage('Beepo reached the bakery! 🥖')
          timers.current.forEach(clearTimeout)
          const w = setTimeout(() => m.win(), 700)
          timers.current.push(w)
          return
        }

        // finished all steps without arriving
        if (i === program.length - 1) {
          const f = setTimeout(() => {
            setRunning(false)
            setMessage('So close! Beepo stopped before the bakery. Add or change steps.')
          }, 350)
          timers.current.push(f)
        }
      }, 500 * (i + 1))
      timers.current.push(t)
    })
  }

  const cellLeft = (x) => `${((x + 0.5) / W) * 100}%`
  const cellTop = (y) => `${((y + 0.5) / H) * 100}%`

  return (
    <GameShell
      title="Programming Village — Teach Beepo the Way"
      accent={level.accent}
      howTo={[
        'Beepo the robot 🤖 must reach the bakery 🥖.',
        'Build an ALGORITHM: click blocks to add steps in order.',
        'Press ▶ Run Program to watch Beepo follow your steps.',
        'Reach the bakery to win! Order matters.',
      ]}
      status={m.status}
      score={
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
          Steps: {program.length}/10
        </span>
      }
      onStart={m.start}
      onBeginPlay={m.beginPlay}
      onPause={m.pause}
      onResume={m.resume}
      onRestart={m.restart}
      onContinue={onComplete}
      winTitle="Delivery Complete!"
      winText="Beepo followed your algorithm perfectly and reached the bakery!"
      fieldClassName="min-h-[460px] bg-gradient-to-b from-emerald-800/40 to-teal-900/50"
    >
      <div className="grid gap-4 p-4 lg:grid-cols-[1.2fr_1fr]">
        {/* BOARD */}
        <div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-emerald-950/40">
            {/* grid cells */}
            <div
              className="grid h-full w-full"
              style={{ gridTemplateColumns: `repeat(${W},1fr)`, gridTemplateRows: `repeat(${H},1fr)` }}
            >
              {Array.from({ length: W * H }).map((_, i) => {
                const x = i % W
                const y = Math.floor(i / W)
                const isBakery = x === BAKERY.x && y === BAKERY.y
                const isStart = x === START.x && y === START.y
                return (
                  <div
                    key={i}
                    className="relative grid place-items-center border border-emerald-400/10"
                  >
                    <span className="absolute inset-0 bg-emerald-500/5" />
                    {isBakery && <span className="text-3xl drop-shadow">🥖</span>}
                    {isStart && !isBakery && <span className="text-lg opacity-40">🏁</span>}
                  </div>
                )
              })}
            </div>

            {/* ghost preview path — shows exactly where the program leads, before Run */}
            {!running && program.length > 0 && (
              <>
                {preview.path.map((p, i) => {
                  if (i === 0) return null
                  const prev = preview.path[i - 1]
                  if (prev.x === p.x && prev.y === p.y) return null // a turn, no move
                  return (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.55 }}
                      className="pointer-events-none absolute z-[5] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-quest-gold"
                      style={{ left: cellLeft(p.x), top: cellTop(p.y) }}
                    />
                  )
                })}
                {/* ghost robot at the predicted final spot */}
                <div
                  className="pointer-events-none absolute z-[6] -translate-x-1/2 -translate-y-1/2 opacity-45"
                  style={{ left: cellLeft(preview.final.x), top: cellTop(preview.final.y) }}
                >
                  <div className="relative grid place-items-center">
                    <span className="text-3xl grayscale">🤖</span>
                    <span
                      className="absolute -right-4 text-lg text-quest-gold"
                      style={{ transform: `rotate(${ARROW_ROT[preview.final.dir]}deg)` }}
                    >
                      ➤
                    </span>
                  </div>
                </div>
                {/* warning if the plan drives off the path */}
                {preview.outOfBounds && preview.bump && (
                  <div
                    className="pointer-events-none absolute z-[6] -translate-x-1/2 -translate-y-1/2 text-2xl"
                    style={{
                      left: `${((Math.min(W - 0.5, Math.max(-0.5, preview.bump.x)) + 0.5) / W) * 100}%`,
                      top: `${((Math.min(H - 0.5, Math.max(-0.5, preview.bump.y)) + 0.5) / H) * 100}%`,
                    }}
                  >
                    ⚠️
                  </div>
                )}
              </>
            )}

            {/* robot */}
            <motion.div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
              animate={{ left: cellLeft(robot.x), top: cellTop(robot.y), rotate: bump ? [0, -8, 8, 0] : 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              style={{ left: cellLeft(robot.x), top: cellTop(robot.y) }}
            >
              <div className="relative grid place-items-center">
                <span className="text-3xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">🤖</span>
                <span
                  className="absolute -right-4 text-xl text-quest-gold drop-shadow-[0_0_4px_rgba(251,191,36,0.9)]"
                  style={{ transform: `rotate(${ARROW_ROT[robot.dir]}deg)` }}
                >
                  ➤
                </span>
              </div>
            </motion.div>
          </div>

          {/* live compass — always visible so facing is never a mystery */}
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm font-bold text-white">
            <span>🧭 Beepo is facing:</span>
            <motion.span
              key={robot.dir}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-quest-gold"
            >
              {DIR_LABEL[robot.dir]}
            </motion.span>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-center text-sm font-semibold text-white"
            >
              {message}
            </motion.div>
          )}
        </div>

        {/* PROGRAM BUILDER */}
        <div className="flex flex-col">
          <div className="mb-2 text-sm font-extrabold text-white">1) Pick your steps</div>
          <div className="grid grid-cols-3 gap-2">
            {BLOCKS.map((b) => (
              <motion.button
                key={b.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={running}
                onClick={() => add(b.id)}
                className={`rounded-xl bg-gradient-to-br ${b.color} px-2 py-3 text-center font-bold text-white shadow-card disabled:opacity-50`}
              >
                <div className="text-2xl leading-none">{b.icon}</div>
                <div className="mt-1 text-[10px] leading-tight">{b.label}</div>
              </motion.button>
            ))}
          </div>
          <div className="mt-1.5 text-[11px] leading-snug text-slate-400">
            💡 Turn Left/Right rotate Beepo relative to the way <b>it&rsquo;s</b> facing — not your
            screen. Watch the ghost robot on the board to preview your plan!
          </div>

          <div className="mb-2 mt-4 flex items-center justify-between">
            <span className="text-sm font-extrabold text-white">2) Your algorithm</span>
            <div className="flex gap-1.5">
              <button
                onClick={undo}
                disabled={running || program.length === 0}
                className="rounded-lg bg-white/10 px-2 py-1 text-xs font-bold text-white disabled:opacity-40"
              >
                Undo
              </button>
              <button
                onClick={clearAll}
                disabled={running || program.length === 0}
                className="rounded-lg bg-white/10 px-2 py-1 text-xs font-bold text-white disabled:opacity-40"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="min-h-[72px] flex-1 rounded-xl border border-white/10 bg-black/20 p-2">
            {program.length === 0 ? (
              <div className="grid h-full place-items-center text-xs text-slate-400">
                Add steps above to build Beepo&rsquo;s path…
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {program.map((id, i) => {
                  const b = BLOCKS.find((x) => x.id === id)
                  return (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`inline-flex items-center gap-1 rounded-lg bg-gradient-to-br ${b.color} px-2 py-1 text-xs font-bold text-white`}
                    >
                      <span className="opacity-70">{i + 1}.</span> {b.icon}
                    </motion.span>
                  )
                })}
              </div>
            )}
          </div>

          {program.length > 0 && !running && (
            <div className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-white/5 px-2 py-1.5 text-xs font-bold text-slate-200">
              {preview.outOfBounds ? (
                <span className="text-rose-300">⚠️ This plan drives off the path!</span>
              ) : (
                <>
                  <span>This plan ends facing:</span>
                  <span className="text-quest-gold">{DIR_LABEL[preview.final.dir]}</span>
                </>
              )}
            </div>
          )}

          <motion.button
            whileHover={{ scale: running ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={run}
            disabled={running || program.length === 0}
            className="btn-glow mt-3 w-full disabled:opacity-50"
          >
            {running ? 'Beepo is moving…' : '▶ Run Program'}
          </motion.button>
        </div>
      </div>
    </GameShell>
  )
}
