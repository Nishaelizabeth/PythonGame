import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext.jsx'
import { useAudio } from '../context/AudioContext.jsx'
import FlowChart from '../components/FlowChart.jsx'
import { CodePanel, LineByLine } from '../components/CodeBlock.jsx'
import Confetti from '../components/Confetti.jsx'
import { XpIcon, CoinIcon, CheckIcon, SparkleIcon, ChevronIcon } from '../components/Icons.jsx'

function StageCard({ children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-strong rounded-3xl p-5 shadow-card sm:p-7 ${className}`}
    >
      {children}
    </motion.section>
  )
}

function NextButton({ onClick, label = 'Continue' }) {
  return (
    <div className="mt-5 flex justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-2.5 font-display font-bold text-white transition hover:bg-white/20"
      >
        {label}
        <span className="h-4 w-4">
          <ChevronIcon width="100%" height="100%" />
        </span>
      </motion.button>
    </div>
  )
}

function SectionTag({ children, color = 'text-quest-sky' }) {
  return (
    <div className={`mb-2 text-xs font-extrabold uppercase tracking-widest ${color}`}>{children}</div>
  )
}

export default function ReflectionSection({ level, onContinueAdventure }) {
  const { name, allAchievements } = useGame()
  const { playSound } = useAudio()
  const r = level.reflection
  const rewards = level.rewards
  const badge = rewards.badge ? allAchievements.find((a) => a.id === rewards.badge) : null

  const [step, setStep] = useState(0) // highest revealed stage
  const [choice, setChoice] = useState(null)
  const [practiceDone, setPracticeDone] = useState(false)

  const advance = () => setStep((s) => s + 1)

  const pick = (i) => {
    setChoice(i)
    if (i === r.practice.answerIndex) {
      setPracticeDone(true)
      playSound('correct')
    } else {
      playSound('wrong')
    }
  }
  const showAnswer = () => {
    setChoice(r.practice.answerIndex)
    setPracticeDone(true)
    playSound('correct')
  }

  return (
    <div className="space-y-5">
      {/* ---------------- STAGE 0: MISSION COMPLETE ---------------- */}
      <StageCard className="relative overflow-hidden text-center">
        <Confetti count={54} duration={3} />
        <motion.div
          animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="mx-auto text-6xl"
        >
          🎉
        </motion.div>
        <h2 className="mt-2 font-display text-4xl font-extrabold gradient-text">Mission Complete!</h2>
        <p className="mt-1 text-slate-200">
          Incredible work, {name}! You conquered <b>{level.name}</b>.
        </p>

        <div className="mx-auto mt-5 grid max-w-lg gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-quest-purple/40 bg-quest-purple/10 p-4">
            <span className="mx-auto mb-1 block h-8 w-8">
              <XpIcon />
            </span>
            <div className="font-display text-2xl font-extrabold text-white">+{rewards.xp}</div>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-400">XP Earned</div>
          </div>
          <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4">
            <span className="mx-auto mb-1 block h-8 w-8">
              <CoinIcon />
            </span>
            <div className="font-display text-2xl font-extrabold text-white">+{rewards.coins}</div>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Coins Earned</div>
          </div>
          <div className="rounded-2xl border border-fuchsia-400/40 bg-fuchsia-400/10 p-4">
            <div className="mx-auto mb-1 text-3xl">{badge ? badge.emoji : '⭐'}</div>
            <div className="font-display text-sm font-extrabold leading-tight text-white">
              {badge ? badge.name : `${rewards.stars} Stars`}
            </div>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
              {badge ? 'Badge Earned' : 'Stars Earned'}
            </div>
          </div>
        </div>

        {step === 0 && <NextButton onClick={advance} label="What did I just do?" />}
      </StageCard>

      {/* ---------------- STAGE 1: WHAT YOU EXPERIENCED ---------------- */}
      {step >= 1 && (
        <StageCard>
          <SectionTag color="text-quest-gold">🔍 What did you just experience?</SectionTag>
          <p className="text-lg leading-relaxed text-slate-100">{r.experienced}</p>
          {step === 1 && <NextButton onClick={advance} label="Show me the flow" />}
        </StageCard>
      )}

      {/* ---------------- STAGE 2: WORKFLOW ---------------- */}
      {step >= 2 && (
        <StageCard>
          <SectionTag color="text-emerald-300">🗺️ The Workflow — what the game was really doing</SectionTag>
          <p className="mb-5 text-slate-300">
            Every game secretly follows a plan. Here is the exact path your game took, step by step:
          </p>
          <FlowChart nodes={r.workflow} />
          {step === 2 && <NextButton onClick={advance} label="Turn it into Python" />}
        </StageCard>
      )}

      {/* ---------------- STAGE 3: PYTHON CONCEPT ---------------- */}
      {step >= 3 && (
        <StageCard>
          <SectionTag color="text-fuchsia-300">🐍 The Python Concept</SectionTag>
          <h3 className="font-display text-2xl font-extrabold text-white">{r.concept.title}</h3>
          <p className="mt-2 text-lg leading-relaxed text-slate-100">{r.concept.body}</p>
          {step === 3 && <NextButton onClick={advance} label="Reveal the code" />}
        </StageCard>
      )}

      {/* ---------------- STAGE 4: THE CODE ---------------- */}
      {step >= 4 && (
        <StageCard>
          <SectionTag color="text-sky-300">💻 The Python Code</SectionTag>
          <p className="mb-3 text-slate-300">
            Here is exactly how a programmer would write what you just played:
          </p>
          <CodePanel lines={r.code} />
          <div className="mt-5">
            <div className="mb-2 text-sm font-extrabold text-slate-200">
              Now, every single line explained — no coding knowledge needed:
            </div>
            <LineByLine lines={r.code} />
          </div>
          {step === 4 && <NextButton onClick={advance} label="Try a quick challenge" />}
        </StageCard>
      )}

      {/* ---------------- STAGE 5: PRACTICE ---------------- */}
      {step >= 5 && (
        <StageCard>
          <SectionTag color="text-orange-300">🧠 Practice Activity</SectionTag>
          <p className="font-display text-lg font-bold text-white">{r.practice.question}</p>

          <div className="mt-4 grid gap-2.5">
            {r.practice.options.map((opt, i) => {
              const isChosen = choice === i
              const isCorrect = i === r.practice.answerIndex
              const showState = choice !== null && (isChosen || (practiceDone && isCorrect))
              let cls = 'border-white/10 bg-white/5 hover:bg-white/10'
              if (showState && isCorrect) cls = 'border-emerald-400 bg-emerald-500/20'
              else if (showState && isChosen && !isCorrect) cls = 'border-rose-400 bg-rose-500/20'
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: practiceDone ? 1 : 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={practiceDone}
                  onClick={() => pick(i)}
                  className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left font-semibold text-white transition ${cls}`}
                >
                  <span>{opt}</span>
                  {showState && isCorrect && (
                    <span className="h-5 w-5 text-emerald-300">
                      <CheckIcon width="100%" height="100%" />
                    </span>
                  )}
                  {showState && isChosen && !isCorrect && <span className="text-rose-300">✗</span>}
                </motion.button>
              )
            })}
          </div>

          <AnimatePresence>
            {choice !== null && !practiceDone && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200"
              >
                <span>Not quite — take another look and try again!</span>
                <button
                  onClick={showAnswer}
                  className="shrink-0 rounded-lg bg-white/10 px-3 py-1 text-xs font-bold text-white hover:bg-white/20"
                >
                  Show answer
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {practiceDone && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                className="mt-4 overflow-hidden rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4"
              >
                <div className="mb-1 flex items-center gap-2 text-sm font-extrabold text-emerald-300">
                  <span className="h-4 w-4">
                    <SparkleIcon width="100%" height="100%" />
                  </span>
                  The Answer
                </div>
                <p className="text-slate-100">{r.practice.reveal}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </StageCard>
      )}

      {/* ---------------- FINAL: CONTINUE ADVENTURE ---------------- */}
      <AnimatePresence>
        {practiceDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2 py-2 text-center"
          >
            <p className="font-display text-lg font-bold text-white">
              You&rsquo;ve truly mastered this, {name}! 🌟
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinueAdventure}
              className="btn-glow text-lg animate-pulseGlow"
            >
              <span className="h-5 w-5">
                <ChevronIcon width="100%" height="100%" />
              </span>
              Continue Adventure
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
