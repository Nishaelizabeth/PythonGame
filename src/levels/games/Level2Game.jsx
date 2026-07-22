import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import GameShell from '../../components/game/GameShell.jsx'
import useGameMachine from '../../components/game/useGameMachine.js'

const CHESTS = [
  { id: 'name', varName: 'player_name', hint: 'the hero of our story', wants: 'v_name' },
  { id: 'coins', varName: 'coins', hint: 'how much treasure you have', wants: 'v_coins' },
  { id: 'level', varName: 'level', hint: 'which stage you are on', wants: 'v_level' },
  { id: 'hero', varName: 'is_hero', hint: 'true or false — are you brave?', wants: 'v_hero' },
]

const VALUES = [
  { id: 'v_name', display: '"Elizabeth"', emoji: '🧝‍♀️' },
  { id: 'v_coins', display: '50', emoji: '💰' },
  { id: 'v_level', display: '2', emoji: '🔢' },
  { id: 'v_hero', display: 'True', emoji: '✅' },
]

export default function Level2Game({ level, onComplete }) {
  const m = useGameMachine()
  const [assigned, setAssigned] = useState({}) // chestId -> valueId
  const [selected, setSelected] = useState(null)
  const [wrong, setWrong] = useState(null) // chestId that shook
  const [msg, setMsg] = useState('')

  const reset = () => {
    setAssigned({})
    setSelected(null)
    setWrong(null)
    setMsg('')
  }
  useEffect(() => reset(), [m.runId])

  const placedValues = new Set(Object.values(assigned))

  const clickValue = (v) => {
    if (placedValues.has(v.id)) return
    setSelected((s) => (s === v.id ? null : v.id))
    setMsg('')
  }

  const clickChest = (chest) => {
    if (assigned[chest.id]) return
    if (!selected) {
      setMsg('First tap a treasure below, then tap the chest it belongs in.')
      return
    }
    if (selected === chest.wants) {
      const next = { ...assigned, [chest.id]: selected }
      setAssigned(next)
      setSelected(null)
      setMsg('Perfect match! ✨')
      if (Object.keys(next).length === CHESTS.length) {
        setTimeout(() => m.win(), 600)
      }
    } else {
      setWrong(chest.id)
      setMsg(`Hmm, that value doesn't belong in "${chest.varName}". Look at the hint!`)
      setTimeout(() => setWrong(null), 500)
    }
  }

  return (
    <GameShell
      title="Memory Forest — Fill the Named Chests"
      accent={level.accent}
      howTo={[
        'Each glowing chest is a VARIABLE with a name carved on it.',
        'Tap a treasure at the bottom to pick it up.',
        'Then tap the chest whose name it belongs to.',
        'Fill all four chests correctly to power up the forest!',
      ]}
      status={m.status}
      score={
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
          {Object.keys(assigned).length}/{CHESTS.length} stored
        </span>
      }
      onStart={m.start}
      onBeginPlay={m.beginPlay}
      onPause={m.pause}
      onResume={m.resume}
      onRestart={m.restart}
      onContinue={onComplete}
      winTitle="Forest Powered Up!"
      winText="Every value found its named chest. That's exactly how variables work!"
      fieldClassName="min-h-[460px] bg-gradient-to-b from-green-800/40 to-emerald-950/60"
    >
      <div className="flex min-h-[460px] flex-col p-4">
        <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CHESTS.map((c) => {
            const val = assigned[c.id] ? VALUES.find((v) => v.id === assigned[c.id]) : null
            return (
              <motion.button
                key={c.id}
                onClick={() => clickChest(c)}
                animate={wrong === c.id ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                whileHover={{ scale: val ? 1 : 1.03 }}
                className={`relative flex flex-col items-center rounded-2xl border-2 p-3 text-center transition ${
                  val
                    ? 'border-emerald-400 bg-emerald-500/15'
                    : selected
                    ? 'border-quest-gold/70 bg-amber-400/10 shadow-glow-gold'
                    : 'border-amber-700/60 bg-amber-900/20'
                }`}
              >
                <div className="text-3xl">{val ? '🧰' : '📦'}</div>
                <div className="mt-1 rounded-md bg-black/30 px-2 py-0.5 font-mono text-xs font-bold text-quest-gold">
                  {c.varName}
                </div>
                <div className="mt-1 text-[10px] italic leading-tight text-slate-300">{c.hint}</div>
                <div className="mt-2 h-7">
                  {val && (
                    <motion.div
                      initial={{ scale: 0, y: -6 }}
                      animate={{ scale: 1, y: 0 }}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/30 px-2 py-1 font-mono text-sm font-bold text-white"
                    >
                      {val.emoji} {val.display}
                    </motion.div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        <div className="min-h-[24px] text-center text-sm font-semibold text-white">{msg}</div>

        <div className="mt-auto">
          <div className="mb-2 text-center text-xs font-extrabold uppercase tracking-wide text-slate-300">
            Treasures to store
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {VALUES.map((v) => {
              const used = placedValues.has(v.id)
              const isSel = selected === v.id
              return (
                <motion.button
                  key={v.id}
                  onClick={() => clickValue(v)}
                  disabled={used}
                  whileHover={{ scale: used ? 1 : 1.08, y: used ? 0 : -4 }}
                  whileTap={{ scale: 0.94 }}
                  animate={isSel ? { y: -8, scale: 1.1 } : { y: 0, scale: 1 }}
                  className={`flex flex-col items-center rounded-2xl border-2 px-4 py-3 font-mono font-bold transition ${
                    used
                      ? 'border-white/5 bg-white/5 text-slate-600 opacity-40'
                      : isSel
                      ? 'border-quest-gold bg-quest-gold/20 text-white shadow-glow-gold'
                      : 'border-white/20 bg-white/10 text-white'
                  }`}
                >
                  <span className="text-2xl">{v.emoji}</span>
                  <span className="mt-1 text-sm">{v.display}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </GameShell>
  )
}
