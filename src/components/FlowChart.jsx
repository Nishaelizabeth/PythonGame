import { motion } from 'framer-motion'

const NODE_STYLES = {
  start: 'from-emerald-500 to-teal-600 border-emerald-300',
  input: 'from-sky-500 to-blue-600 border-sky-300',
  process: 'from-violet-500 to-purple-600 border-violet-300',
  end: 'from-amber-500 to-orange-600 border-amber-300',
}

function Arrow() {
  return (
    <div className="my-1 flex flex-col items-center text-slate-400">
      <div className="h-4 w-0.5 bg-slate-500/70" />
      <svg viewBox="0 0 24 24" className="-mt-1 h-4 w-4" fill="currentColor">
        <path d="M12 21l-7-8h14z" />
      </svg>
    </div>
  )
}

function Node({ node }) {
  if (node.type === 'decision') {
    return (
      <div className="flex w-full flex-col items-center">
        {/* diamond-ish question card */}
        <div className="relative w-full max-w-md">
          <div className="rounded-2xl border-2 border-yellow-300/70 bg-gradient-to-br from-yellow-400/20 to-amber-500/10 px-5 py-3 text-center">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-300">
              Decision
            </div>
            <div className="font-display text-base font-bold text-white">{node.label}</div>
          </div>
        </div>
        {/* branches */}
        <div className="mt-3 grid w-full max-w-lg grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-400/50 bg-emerald-500/10 p-2.5 text-center">
            <div className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-300">
              ✓ Yes
            </div>
            <div className="text-sm font-semibold text-white">{node.yes}</div>
          </div>
          <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-2.5 text-center">
            <div className="text-[10px] font-extrabold uppercase tracking-wide text-rose-300">
              ✗ No
            </div>
            <div className="text-sm font-semibold text-white">{node.no}</div>
          </div>
        </div>
      </div>
    )
  }

  const style = NODE_STYLES[node.type] || NODE_STYLES.process
  return (
    <div
      className={`rounded-2xl border-2 bg-gradient-to-br px-5 py-3 text-center font-display font-bold text-white shadow-card ${style}`}
    >
      {node.label}
    </div>
  )
}

export default function FlowChart({ nodes = [] }) {
  return (
    <div className="flex flex-col items-center">
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: i * 0.08 }}
          className="flex w-full flex-col items-center"
        >
          <Node node={node} />
          {i < nodes.length - 1 && <Arrow />}
        </motion.div>
      ))}
    </div>
  )
}
