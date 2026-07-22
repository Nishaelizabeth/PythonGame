import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { BreadcrumbProvider } from './context/BreadcrumbContext.jsx'
import { useGame } from './context/GameContext.jsx'
import Background from './components/Background.jsx'
import Navbar from './components/Navbar.jsx'
import Breadcrumbs from './components/Breadcrumbs.jsx'
import WelcomeBack from './components/WelcomeBack.jsx'

import Home from './pages/Home.jsx'
import WorldMap from './pages/WorldMap.jsx'
import Level from './pages/Level.jsx'
import Achievements from './pages/Achievements.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

function ContinueRedirect() {
  const { level } = useGame()
  return <Navigate to={`/level/${level}`} replace />
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<WorldMap />} />
        <Route path="/continue" element={<ContinueRedirect />} />
        <Route path="/level/:id" element={<Level />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const { settings } = useGame()
  return (
    <BreadcrumbProvider>
      <div className={settings?.highContrast ? 'contrast-125 saturate-150' : ''}>
        <Background />
        <Navbar />
        <Breadcrumbs />
        <WelcomeBack />
        <AnimatedRoutes />
        <footer className="relative z-10 mx-auto max-w-7xl px-6 pb-6 text-center text-xs font-semibold text-slate-500">
          Python Quest • A magical way to learn Python • Made for Elizabeth ✨
        </footer>
      </div>
    </BreadcrumbProvider>
  )
}
