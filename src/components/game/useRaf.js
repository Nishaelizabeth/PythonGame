import { useEffect, useRef } from 'react'

// Runs `cb(dtSeconds)` every animation frame while `active` is true.
export default function useRaf(cb, active) {
  const cbRef = useRef(cb)
  cbRef.current = cb
  useEffect(() => {
    if (!active) return
    let raf
    let last = performance.now()
    const loop = (t) => {
      const dt = Math.min(50, t - last) / 1000
      last = t
      cbRef.current(dt)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])
}

// Attaches keydown/keyup listeners only while `active`, tracking held keys in a ref set.
export function useKeys(active) {
  const keys = useRef(new Set())
  useEffect(() => {
    if (!active) {
      keys.current.clear()
      return
    }
    const down = (e) => {
      keys.current.add(e.key)
    }
    const up = (e) => keys.current.delete(e.key)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      keys.current.clear()
    }
  }, [active])
  return keys
}
