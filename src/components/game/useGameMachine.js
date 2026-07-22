import { useCallback, useState } from 'react'

// Shared status machine for every mini-game.
// status: 'ready' | 'countdown' | 'playing' | 'paused' | 'won' | 'lost'
export default function useGameMachine() {
  const [status, setStatus] = useState('ready')
  const [runId, setRunId] = useState(0)

  const start = useCallback(() => setStatus('countdown'), [])
  const beginPlay = useCallback(() => setStatus('playing'), [])
  const win = useCallback(() => setStatus((s) => (s === 'won' ? s : 'won')), [])
  const lose = useCallback(() => setStatus((s) => (s === 'lost' ? s : 'lost')), [])
  const pause = useCallback(() => setStatus((s) => (s === 'playing' ? 'paused' : s)), [])
  const resume = useCallback(() => setStatus((s) => (s === 'paused' ? 'playing' : s)), [])
  const restart = useCallback(() => {
    setRunId((r) => r + 1)
    setStatus('countdown')
  }, [])

  return { status, runId, start, beginPlay, win, lose, pause, resume, restart, setStatus }
}
