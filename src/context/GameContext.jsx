import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { LEVELS } from '../data/levels.js'
import { ACHIEVEMENTS } from '../data/achievements.js'

const STORAGE_KEY = 'python-quest-save-v1'
const PLAYER_NAME = 'Elizabeth'

const defaultState = {
  name: PLAYER_NAME,
  xp: 0,
  coins: 0,
  stars: 0,
  currentLevel: 1, // highest unlocked level
  completedLevels: [], // array of level ids
  achievements: [], // array of achievement ids
  streak: 1,
  lastVisit: null,
  settings: {
    music: true,
    sfx: true,
    reducedMotion: false,
    highContrast: false,
  },
  hasStarted: false,
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState }
    const parsed = JSON.parse(raw)
    return {
      ...defaultState,
      ...parsed,
      settings: { ...defaultState.settings, ...(parsed.settings || {}) },
    }
  } catch (e) {
    return { ...defaultState }
  }
}

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [returning, setReturning] = useState(false)

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      /* ignore quota errors */
    }
  }, [state])

  // Compute a simple daily streak + "welcome back" flag on first mount
  useEffect(() => {
    const today = new Date().toDateString()
    // Decide "welcome back" from the value loaded at mount time
    if (state.lastVisit && state.lastVisit !== today && state.hasStarted) {
      setReturning(true)
    }
    setState((prev) => {
      let streak = prev.streak || 1
      if (prev.lastVisit && prev.lastVisit !== today) streak = streak + 1
      return { ...prev, lastVisit: today, streak }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const markStarted = useCallback(() => {
    setState((prev) => (prev.hasStarted ? prev : { ...prev, hasStarted: true }))
  }, [])

  const isUnlocked = useCallback(
    (levelId) => levelId <= state.currentLevel,
    [state.currentLevel]
  )
  const isCompleted = useCallback(
    (levelId) => state.completedLevels.includes(levelId),
    [state.completedLevels]
  )

  const unlockAchievement = useCallback((achId) => {
    setState((prev) => {
      if (prev.achievements.includes(achId)) return prev
      return { ...prev, achievements: [...prev.achievements, achId] }
    })
  }, [])

  // Called when a level's reflection is fully finished
  const completeLevel = useCallback((levelId, { xp = 100, coins = 50, stars = 3 } = {}) => {
    setState((prev) => {
      const alreadyDone = prev.completedLevels.includes(levelId)
      const nextCompleted = alreadyDone
        ? prev.completedLevels
        : [...prev.completedLevels, levelId]

      // Unlock next level
      const nextLevel = Math.min(LEVELS.length, Math.max(prev.currentLevel, levelId + 1))

      // Only award XP/coins/stars the first time a level is completed
      const gainedXp = alreadyDone ? 0 : xp
      const gainedCoins = alreadyDone ? 0 : coins
      const gainedStars = alreadyDone ? 0 : stars

      // Auto achievements
      const newAch = new Set(prev.achievements)
      newAch.add('first-steps') // completing any level
      if (nextCompleted.length >= 3) newAch.add('rising-coder')
      if (nextCompleted.length >= 6) newAch.add('logic-master')
      if (nextCompleted.length >= 9) newAch.add('loop-legend')
      if (nextCompleted.length >= LEVELS.length) newAch.add('grand-wizard')
      if (levelId === 5) newAch.add('io-explorer')
      if (levelId === 12) newAch.add('spellcaster')

      return {
        ...prev,
        completedLevels: nextCompleted,
        currentLevel: nextLevel,
        xp: prev.xp + gainedXp,
        coins: prev.coins + gainedCoins,
        stars: prev.stars + gainedStars,
        achievements: [...newAch],
        hasStarted: true,
      }
    })
  }, [])

  const addCoins = useCallback((amount) => {
    setState((prev) => ({ ...prev, coins: prev.coins + amount }))
  }, [])

  const updateSettings = useCallback((patch) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }))
  }, [])

  const resetProgress = useCallback(() => {
    const fresh = { ...defaultState, lastVisit: new Date().toDateString() }
    setState(fresh)
    setReturning(false)
  }, [])

  const level = useMemo(() => Math.min(LEVELS.length, state.currentLevel), [state.currentLevel])

  const value = useMemo(
    () => ({
      ...state,
      level,
      returning,
      dismissReturning: () => setReturning(false),
      markStarted,
      isUnlocked,
      isCompleted,
      completeLevel,
      unlockAchievement,
      addCoins,
      updateSettings,
      resetProgress,
      totalLevels: LEVELS.length,
      allAchievements: ACHIEVEMENTS,
    }),
    [
      state,
      level,
      returning,
      markStarted,
      isUnlocked,
      isCompleted,
      completeLevel,
      unlockAchievement,
      addCoins,
      updateSettings,
      resetProgress,
    ]
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
