import { AnimatePresence, motion } from 'framer-motion'
import { transitions } from '../../lib/motion'

/**
 * Collapsing error strip shown above a form's fields.
 *
 * Renders a red alert paragraph that animates its height open when a message
 * arrives and closed when it clears; nothing is rendered when `message` is
 * null.
 *
 * @param message - The error to show, or null to collapse the banner.
 */
export default function FormBanner({ message }: { message: string | null }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={transitions.quick}
          className="overflow-hidden"
        >
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13.5px] leading-snug text-red-700"
          >
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
