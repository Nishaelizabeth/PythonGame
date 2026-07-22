import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '../../components/game/GameShell.jsx'
import useGameMachine from '../../components/game/useGameMachine.js'

const ROUNDS = [
  {
    family: 'Arithmetic',
    left: '6',
    right: '4',
    goal: 'Make the answer equal 10',
    options: ['+', '-', '*', '/'],
    correct: '+',
  },
  {
    family: 'Comparison',
    left: '9',
    right: '2',
    goal: 'Make this spell TRUE',
    options: ['>', '<', '==', '!='],
    correct: '>',
  },
  {
    family: 'Logical',
    left: 'True',
    right: 'False',
    goal: 'Make this spell TRUE',
    options: ['and', 'or', 'not'],
    correct: 'or',
  },
  {
    family: 'Assignment',
    left: 'score',
    right: '100',
    goal: 'STORE 100 into the box called score',
    options: ['=', '==', '+='],
    correct: '=',
  },
  {
    family: 'Membership',
    left: '"gold"',
    right: 'treasure_bag',
    goal: 'Ask "is gold inside?" — make it TRUE',
    options: ['in', 'not in', 'is'],
    correct: 'in',
  },
  {
    family: 'Identity',
    left: 'player',
    right: 'player',
    goal: 'Ask "the exact same object?" — make it TRUE',
    options: ['is', 'is not', 'in'],
    correct: 'is',
  },
]

export default function Level4Game({ level, onComplete }) {
  const m = useGameMachine()
  const [idx, setIdx] = useState(0)
  const [wrong, setWrong] = useState(null)
  const [justSolved, setJustSolved] = useState(false)
  const [msg, setMsg] = useState('')

  const reset = () => {
    setIdx(0)
    setWrong(null)
    setJustSolved(false)
    setMsg('')
  }
  useEffect(() => reset(), [m.runId])

  const round = ROUNDS[Math.min(idx, ROUNDS.length - 1)]

  const choose = (op) => {
    if (m.status !== 'playing' || justSolved) return
    if (op === round.correct) {
      setJustSolved(true)
      setMsg(`Yes! ${round.family} operator "${op}" lights the bridge! ✨`)
      setTimeout(() => {
        const next = idx + 1
        setJustSolved(false)
        setMsg('')
        if (next >= ROUNDS.length) m.win()
        else setIdx(next)
      }, 900)
    } else {
      setWrong(op)
      setMsg('That symbol keeps the bridge dark. Try another operator!')
      setTimeout(() => setWrong(null), 450)
    }
  }

  return (
    <GameShell
      title="Operator Valley — Light the Bridges"
      accent={level.accent}
      howTo={[
        'Each bridge needs the right OPERATOR to light up.',
        'Read the goal, then choose the symbol that completes the spell.',
        'Operators do maths, compare values, or combine True/False answers.',
        'Light all 6 bridges to cross the valley!',
      ]}
      status={m.status}
      score={
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
          Bridge {Math.min(idx + 1, ROUNDS.length)}/{ROUNDS.length}
        </span>
      }
      onStart={m.start}
      onBeginPlay={m.beginPlay}
      onPause={m.pause}
      onResume={m.resume}
      onRestart={m.restart}
      onContinue={onComplete}
      winTitle="Valley Crossed!"
      winText="Every bridge glows! You matched the perfect operator to each spell."
      fieldClassName="min-h-[470px] bg-gradient-to-b from-orange-800/40 to-rose-950/60"
    >
      <div className="flex min-h-[470px] flex-col p-4">
        {/* Bridge progress with hero */}
        <div className="relative mb-5 mt-2">
          <div className="flex items-end justify-between px-1">
            {ROUNDS.map((_, i) => {
              const lit = i < idx || (i === idx && justSolved)
              return (
                <div key={i} className="flex flex-1 flex-col items-center">
                  <div
                    className={`h-2 w-full rounded-full transition-all ${
                      lit ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-glow-green' : 'bg-white/10'
                    }`}
                  />
                </div>
              )
            })}
          </div>
          {/* hero */}
          <motion.div
            className="absolute -top-6 text-2xl"
            animate={{ left: `${(Math.min(idx + (justSolved ? 1 : 0), ROUNDS.length) / ROUNDS.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
            style={{ transform: 'translateX(-50%)' }}
          >
            🧝‍♀️
          </motion.div>
          <div className="absolute -top-6 right-0 text-2xl">🏰</div>
        </div>

        {/* Expression */}
        <div className="grid flex-1 place-items-center">
          <div className="w-full max-w-lg text-center">
            <div className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-quest-gold">
              {round.family} Operator
            </div>
            <p className="mt-2 text-slate-200">{round.goal}</p>

            <div className="mt-4 flex items-center justify-center gap-3 font-mono text-3xl font-extrabold text-white">
              <span className="rounded-xl bg-white/10 px-4 py-2">{round.left}</span>
              <motion.span
                animate={justSolved ? { scale: [1, 1.4, 1] } : {}}
                className={`grid h-14 w-14 place-items-center rounded-xl border-2 ${
                  justSolved ? 'border-emerald-400 bg-emerald-500/20' : 'border-dashed border-quest-gold/70 bg-black/30'
                }`}
              >
                {justSolved ? round.correct : '?'}
              </motion.span>
              <span className="rounded-xl bg-white/10 px-4 py-2">{round.right}</span>
            </div>

            {/* Options */}
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              {round.options.map((op) => (
                <motion.button
                  key={op}
                  onClick={() => choose(op)}
                  disabled={justSolved}
                  animate={wrong === op ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                  whileHover={{ scale: justSolved ? 1 : 1.08, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  className={`min-w-[64px] rounded-xl border-2 px-4 py-3 font-mono text-xl font-extrabold text-white transition ${
                    wrong === op
                      ? 'border-rose-400 bg-rose-500/20'
                      : 'border-white/20 bg-gradient-to-br from-amber-500/30 to-orange-600/20 hover:border-quest-gold'
                  }`}
                >
                  {op}
                </motion.button>
              ))}
            </div>

            <div className="mt-4 min-h-[24px] text-sm font-semibold text-white">{msg}</div>
          </div>
        </div>
      </div>
    </GameShell>
  )
}
