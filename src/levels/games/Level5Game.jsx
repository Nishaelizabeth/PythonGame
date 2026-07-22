import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/game/GameShell.jsx'
import useGameMachine from '../../components/game/useGameMachine.js'

export default function Level5Game({ level, onComplete }) {
  const m = useGameMachine()
  const [raw, setRaw] = useState('5')
  const [log, setLog] = useState([])
  const [flags, setFlags] = useState({ asked: false, sawText: false, fixed: false })
  const logRef = useRef(null)

  const reset = () => {
    setRaw('5')
    setLog([])
    setFlags({ asked: false, sawText: false, fixed: false })
  }
  useEffect(() => reset(), [m.runId])

  const push = (lines) => setLog((l) => [...l, ...lines])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [log])

  useEffect(() => {
    if (flags.asked && flags.sawText && flags.fixed && m.status === 'playing') {
      const t = setTimeout(() => m.win(), 900)
      return () => clearTimeout(t)
    }
  }, [flags, m])

  const value = raw === '' ? '5' : raw

  const doAsk = () => {
    push([
      { k: 'cmd', t: '>>> a = input("Enter a number: ")' },
      { k: 'you', t: `⌨️  you typed: ${value}` },
      { k: 'out', t: `a is now  "${value}"   ← stored as TEXT, not a number!` },
      { k: 'out', t: `>>> type(a)  →  <class 'str'>` },
    ])
    setFlags((f) => ({ ...f, asked: true }))
  }

  const doTextAdd = () => {
    if (!flags.asked) {
      push([{ k: 'warn', t: 'First press "Ask the machine (input)" above! ☝️' }])
      return
    }
    push([
      { k: 'cmd', t: '>>> print(a + a)' },
      { k: 'bad', t: `"${value}${value}"   😵  GLITCH! The machine glued the text together.` },
    ])
    setFlags((f) => ({ ...f, sawText: true }))
  }

  const doIntAdd = () => {
    if (!flags.asked) {
      push([{ k: 'warn', t: 'First press "Ask the machine (input)" above! ☝️' }])
      return
    }
    const n = parseInt(value, 10)
    push([
      { k: 'cmd', t: '>>> print(int(a) + int(a))' },
      { k: 'good', t: `${n + n}   ✅  int() turned the text into real numbers — now it does maths!` },
    ])
    setFlags((f) => ({ ...f, fixed: true }))
  }

  const colorOf = (k) =>
    ({
      cmd: 'text-sky-300',
      you: 'text-slate-400',
      out: 'text-slate-200',
      bad: 'text-rose-300 font-bold',
      good: 'text-emerald-300 font-bold',
      warn: 'text-amber-300',
    }[k] || 'text-slate-200')

  const Check = ({ on, children }) => (
    <div
      className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
        on ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/5 text-slate-400'
      }`}
    >
      <span
        className={`grid h-4 w-4 place-items-center rounded-full text-[10px] ${
          on ? 'bg-emerald-400 text-slate-900' : 'bg-white/10'
        }`}
      >
        {on ? '✓' : '•'}
      </span>
      {children}
    </div>
  )

  return (
    <GameShell
      title="Input & Output Town — The Talking Machine"
      accent={level.accent}
      howTo={[
        'The vending machine ASKS for a number, then SHOWS an answer.',
        'Type a number, then press each button to talk to the machine.',
        'Discover why "5" + "5" is NOT 10 — and how int() fixes it.',
        'Uncover all 3 secrets to make the machine give your prize! 🎁',
      ]}
      status={m.status}
      score={
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
          {Object.values(flags).filter(Boolean).length}/3 secrets
        </span>
      }
      onStart={m.start}
      onBeginPlay={m.beginPlay}
      onPause={m.pause}
      onResume={m.resume}
      onRestart={m.restart}
      onContinue={onComplete}
      winTitle="Mystery Solved!"
      winText="You discovered that input() always returns a string — and int() converts it to a real number!"
      fieldClassName="min-h-[480px] bg-gradient-to-b from-cyan-800/40 to-blue-950/60"
    >
      <div className="grid min-h-[480px] gap-4 p-4 lg:grid-cols-[1fr_1.1fr]">
        {/* Machine + controls */}
        <div className="flex flex-col">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mx-auto grid h-28 w-28 place-items-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 text-6xl shadow-glow"
          >
            🤖
          </motion.div>
          <div className="mt-3 rounded-2xl bg-black/30 p-3 text-center text-sm font-semibold text-cyan-100">
            &ldquo;Type a number and let&rsquo;s see what I hear!&rdquo;
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="font-mono text-sm text-slate-300">input:</span>
            <input
              value={raw}
              onChange={(e) => setRaw(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
              inputMode="numeric"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 font-mono text-lg font-bold text-white outline-none focus:border-quest-sky"
              placeholder="type a number"
            />
          </div>

          <div className="mt-3 grid gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={doAsk}
              className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-card"
            >
              1) Ask the machine — input()
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={doTextAdd}
              className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-card"
            >
              2) Add as typed — print(a + a)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={doIntAdd}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-card"
            >
              3) Convert first — print(int(a) + int(a))
            </motion.button>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-1.5">
            <Check on={flags.asked}>Asked the machine (input → text)</Check>
            <Check on={flags.sawText}>Saw the &ldquo;{value}{value}&rdquo; text-glue glitch</Check>
            <Check on={flags.fixed}>Fixed it with int() → got {parseInt(value, 10) + parseInt(value, 10)}</Check>
          </div>
        </div>

        {/* Terminal */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#05070f]">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-2 text-xs text-slate-500">python — town terminal</span>
          </div>
          <div ref={logRef} className="flex-1 space-y-1 overflow-y-auto p-3 font-mono text-xs leading-relaxed">
            {log.length === 0 && (
              <div className="text-slate-600">
                # Press the buttons on the left to talk to the machine…
              </div>
            )}
            <AnimatePresence initial={false}>
              {log.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={colorOf(line.k)}
                >
                  {line.t}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </GameShell>
  )
}
