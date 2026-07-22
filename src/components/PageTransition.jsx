import { motion } from 'framer-motion'

// Wrap page content for a smooth enter/exit transition.
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.99 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto w-full max-w-7xl px-4 pb-24 pt-4 ${className}`}
    >
      {children}
    </motion.main>
  )
}
