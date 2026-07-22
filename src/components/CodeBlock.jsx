import { motion } from 'framer-motion'

const KEYWORDS = [
  'if',
  'elif',
  'else',
  'for',
  'while',
  'in',
  'return',
  'def',
  'and',
  'or',
  'not',
  'True',
  'False',
  'print',
  'input',
  'int',
  'float',
  'str',
  'type',
  'len',
  'range',
  'append',
]

// Very small, safe token highlighter (no eval, pure display).
function highlight(line) {
  // Split keeping delimiters (quotes, spaces, parens, operators)
  const parts = line.split(/(\s+|"[^"]*"|\(|\)|:|,|\d+\.\d+|\d+)/g).filter((p) => p !== '')
  return parts.map((tok, i) => {
    let cls = 'text-slate-100'
    if (/^"[^"]*"$/.test(tok)) cls = 'text-emerald-300'
    else if (/^\d+\.\d+$/.test(tok) || /^\d+$/.test(tok)) cls = 'text-amber-300'
    else if (KEYWORDS.includes(tok.trim())) cls = 'text-fuchsia-300 font-bold'
    else if (tok === ':' || tok === '(' || tok === ')' || tok === ',') cls = 'text-sky-300'
    return (
      <span key={i} className={cls}>
        {tok}
      </span>
    )
  })
}

export function CodePanel({ lines }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0c1024] p-4 font-mono text-sm shadow-card">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-rose-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-xs text-slate-500">quest.py</span>
      </div>
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12 }}
          className="flex gap-3 whitespace-pre leading-relaxed"
        >
          <span className="select-none text-slate-600">{String(i + 1).padStart(2, ' ')}</span>
          <code>{highlight(l.code)}</code>
        </motion.div>
      ))}
    </div>
  )
}

export function LineByLine({ lines }) {
  return (
    <div className="space-y-2.5">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ delay: i * 0.08 }}
          className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-3 sm:flex-row sm:items-start sm:gap-3"
        >
          <code className="shrink-0 rounded-lg bg-[#0c1024] px-2.5 py-1 font-mono text-xs sm:min-w-[42%]">
            {highlight(l.code)}
          </code>
          <p className="text-sm text-slate-200">{l.explain}</p>
        </motion.div>
      ))}
    </div>
  )
}
