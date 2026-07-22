import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const BreadcrumbContext = createContext(null)

export function BreadcrumbProvider({ children }) {
  // trail: array of { label, to } — `to` optional (last item has none)
  const [trail, setTrail] = useState([])
  const value = { trail, setTrail }
  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>
}

export function useBreadcrumbSetter() {
  const ctx = useContext(BreadcrumbContext)
  return ctx?.setTrail || (() => {})
}

export function useBreadcrumbTrail() {
  const ctx = useContext(BreadcrumbContext)
  return ctx?.trail || []
}

// Convenience hook a page calls to declare its breadcrumb trail.
export function useBreadcrumbs(trail) {
  const setTrail = useBreadcrumbSetter()
  const key = JSON.stringify(trail)
  const stable = useCallback(() => setTrail(trail), [key]) // eslint-disable-line
  useEffect(() => {
    stable()
    return () => setTrail([])
  }, [stable]) // eslint-disable-line
}
