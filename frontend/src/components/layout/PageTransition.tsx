import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { transitions } from '../../lib/motion'

/**
 * Wraps a route's content so pages cross-fade instead of snapping.
 *
 * Renders the page inside a <main> that fades and shifts on enter and exit;
 * the <AnimatePresence> in App.tsx drives the exit half.
 *
 * @param children - The routed page content.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={transitions.quick}
    >
      {children}
    </motion.main>
  )
}
