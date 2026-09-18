import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { fadeUp, stagger, transitions } from '../lib/motion'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found')

  const location = useLocation()

  return (
    <section className="relative overflow-hidden">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transitions.soft}
        className="pointer-events-none absolute inset-x-0 -top-44 h-[26rem] bg-[radial-gradient(55%_55%_at_50%_0%,var(--color-accent-soft)_0%,transparent_70%)]"
      />

      <motion.div
        variants={stagger(0.08, 0.05)}
        initial="hidden"
        animate="show"
        className="shell relative flex min-h-[calc(100dvh-4.5rem)] flex-col items-center justify-center py-20 text-center"
      >
        <motion.p
          variants={fadeUp}
          className="text-[13px] font-medium tracking-[0.14em] text-accent uppercase"
        >
          404
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-4 max-w-xl text-[2.25rem] leading-[1.1] font-semibold md:text-[2.75rem]"
        >
          There's nothing at this address.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-md text-[16.5px] leading-relaxed text-muted text-pretty"
        >
          The page you were looking for either moved or never existed. No harm
          done — the catalogue is one click away.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-3 font-mono text-[12.5px] break-all text-faint"
        >
          {location.pathname}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <Link
            to="/"
            className="rounded-full bg-accent px-5 py-2.5 text-[14.5px] font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
          >
            Back home
          </Link>
          <Link
            to="/shop"
            className="rounded-full border border-line-strong px-5 py-2.5 text-[14.5px] font-medium text-ink transition-colors duration-200 hover:border-accent-ring hover:text-accent"
          >
            Browse the shop
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
