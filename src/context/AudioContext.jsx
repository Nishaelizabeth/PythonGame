import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { useGame } from './GameContext.jsx'

const AudioContext = createContext(null)

const MELODY = [
  523.25, 659.25, 783.99, 659.25,
  587.33, 698.46, 880.0, 698.46,
  493.88, 587.33, 739.99, 587.33,
  523.25, 659.25, 783.99, 987.77,
]

const BASS = [130.81, 146.83, 123.47, 130.81]

function createVoice(ctx, destination, frequency, start, duration, volume, type = 'sine', voices) {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.025)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  oscillator.connect(gain)
  gain.connect(destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.03)

  if (voices) {
    voices.add(oscillator)
    oscillator.addEventListener('ended', () => voices.delete(oscillator), { once: true })
  }

  return oscillator
}

export function AudioProvider({ children }) {
  const { settings } = useGame()
  const audioRef = useRef(null)
  const musicTimerRef = useRef(null)
  const musicStepRef = useRef(0)
  const nextNoteRef = useRef(0)
  const musicPlayingRef = useRef(false)
  const musicVoicesRef = useRef(new Set())
  const settingsRef = useRef(settings)

  settingsRef.current = settings

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current

    const BrowserAudioContext = window.AudioContext || window.webkitAudioContext
    if (!BrowserAudioContext) return null

    const ctx = new BrowserAudioContext()
    const master = ctx.createGain()
    const music = ctx.createGain()
    const sfx = ctx.createGain()

    master.gain.value = 0.8
    music.gain.value = 0.0001
    sfx.gain.value = 0.3
    music.connect(master)
    sfx.connect(master)
    master.connect(ctx.destination)

    audioRef.current = { ctx, master, music, sfx }
    return audioRef.current
  }, [])

  const stopMusic = useCallback(() => {
    musicPlayingRef.current = false
    if (musicTimerRef.current) window.clearTimeout(musicTimerRef.current)
    musicTimerRef.current = null

    for (const oscillator of musicVoicesRef.current) {
      try {
        oscillator.stop()
      } catch {
        // The voice might already have ended.
      }
    }
    musicVoicesRef.current.clear()

    const audio = audioRef.current
    if (audio) {
      const now = audio.ctx.currentTime
      audio.music.gain.cancelScheduledValues(now)
      audio.music.gain.setTargetAtTime(0.0001, now, 0.04)
    }
  }, [])

  const startMusic = useCallback(() => {
    const audio = ensureAudio()
    if (!audio || musicPlayingRef.current || !settingsRef.current.music) return

    audio.ctx.resume().catch(() => {})
    musicPlayingRef.current = true
    musicStepRef.current = 0
    nextNoteRef.current = audio.ctx.currentTime + 0.08

    const now = audio.ctx.currentTime
    audio.music.gain.cancelScheduledValues(now)
    audio.music.gain.setValueAtTime(0.0001, now)
    audio.music.gain.exponentialRampToValueAtTime(0.13, now + 0.8)

    const schedule = () => {
      if (!musicPlayingRef.current) return

      const horizon = audio.ctx.currentTime + 0.7
      while (nextNoteRef.current < horizon) {
        const step = musicStepRef.current
        const start = nextNoteRef.current
        const note = MELODY[step % MELODY.length]

        createVoice(audio.ctx, audio.music, note, start, 0.27, 0.12, 'triangle', musicVoicesRef.current)
        createVoice(audio.ctx, audio.music, note * 2, start, 0.18, 0.025, 'sine', musicVoicesRef.current)

        if (step % 4 === 0) {
          const bass = BASS[Math.floor(step / 4) % BASS.length]
          createVoice(audio.ctx, audio.music, bass, start, 1.05, 0.13, 'sine', musicVoicesRef.current)
        }

        musicStepRef.current += 1
        nextNoteRef.current += 0.32
      }

      musicTimerRef.current = window.setTimeout(schedule, 160)
    }

    schedule()
  }, [ensureAudio])

  const playSound = useCallback((name = 'click') => {
    const audio = ensureAudio()
    if (!audio || !settingsRef.current.sfx) return

    audio.ctx.resume().catch(() => {})
    const now = audio.ctx.currentTime + 0.01
    const note = (frequency, offset, duration, volume, type = 'sine') =>
      createVoice(audio.ctx, audio.sfx, frequency, now + offset, duration, volume, type)

    switch (name) {
      case 'correct':
        note(523.25, 0, 0.14, 0.25, 'triangle')
        note(659.25, 0.1, 0.16, 0.25, 'triangle')
        note(783.99, 0.2, 0.3, 0.3, 'triangle')
        break
      case 'wrong':
        note(220, 0, 0.16, 0.22, 'sawtooth')
        note(174.61, 0.12, 0.3, 0.2, 'sawtooth')
        break
      case 'victory':
        // Let the final fanfare stand well above the background soundtrack.
        if (musicPlayingRef.current) {
          audio.music.gain.cancelScheduledValues(now)
          audio.music.gain.setValueAtTime(audio.music.gain.value, now)
          audio.music.gain.linearRampToValueAtTime(0.025, now + 0.08)
          audio.music.gain.linearRampToValueAtTime(0.13, now + 1.65)
        }
        note(261.63, 0, 0.5, 0.48, 'triangle')
        note(523.25, 0, 0.24, 0.62, 'triangle')
        note(659.25, 0.13, 0.26, 0.66, 'triangle')
        note(783.99, 0.27, 0.3, 0.7, 'triangle')
        note(1046.5, 0.43, 0.85, 0.78, 'sine')
        note(783.99, 0.43, 0.85, 0.42, 'triangle')
        note(523.25, 0.43, 0.85, 0.36, 'sine')
        break
      case 'failure':
        note(329.63, 0, 0.22, 0.2, 'triangle')
        note(277.18, 0.16, 0.22, 0.2, 'triangle')
        note(220, 0.32, 0.48, 0.22, 'triangle')
        break
      case 'countdown':
        note(440, 0, 0.11, 0.18, 'square')
        break
      case 'start':
        note(659.25, 0, 0.12, 0.22, 'square')
        note(987.77, 0.1, 0.3, 0.25, 'triangle')
        break
      case 'click':
      default:
        note(620, 0, 0.045, 0.11, 'sine')
        note(820, 0.035, 0.055, 0.08, 'sine')
        break
    }
  }, [ensureAudio])

  useEffect(() => {
    const unlock = () => {
      const audio = ensureAudio()
      audio?.ctx.resume().catch(() => {})
      if (settingsRef.current.music) startMusic()
    }

    window.addEventListener('pointerdown', unlock, { once: true, capture: true })
    window.addEventListener('keydown', unlock, { once: true, capture: true })
    return () => {
      window.removeEventListener('pointerdown', unlock, true)
      window.removeEventListener('keydown', unlock, true)
    }
  }, [ensureAudio, startMusic])

  useEffect(() => {
    const handleClick = (event) => {
      if (event.target.closest('button, a, [role="button"]')) playSound('click')
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [playSound])

  useEffect(() => {
    if (settings.music) {
      if (audioRef.current) startMusic()
    } else {
      stopMusic()
    }
  }, [settings.music, startMusic, stopMusic])

  useEffect(() => () => {
    stopMusic()
    const audio = audioRef.current
    if (audio && audio.ctx.state !== 'closed') audio.ctx.close().catch(() => {})
  }, [stopMusic])

  const value = useMemo(() => ({ playSound }), [playSound])

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export function useAudio() {
  const value = useContext(AudioContext)
  if (!value) throw new Error('useAudio must be used inside AudioProvider')
  return value
}
