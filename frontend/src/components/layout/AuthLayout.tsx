import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { fade, fadeUp, stagger } from '../../lib/motion'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  /** Rendered under the card — usually the link to the other auth page. */
  footer: ReactNode
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <section className="relative overflow-hidden">
      <motion.div
        aria-hidden
        variants={fade}
        initial="hidden"
        animate="show"
        className="pointer-events-none absolute inset-x-0 -top-48 h-[32rem] bg-[radial-gradient(55%_55%_at_50%_0%,var(--color-accent-soft)_0%,transparent_70%)]"
      />

      <motion.div
        variants={stagger(0.07, 0.05)}
        initial="hidden"
        animate="show"
        className="shell relative flex min-h-[calc(100dvh-4.5rem)] flex-col items-center justify-center py-16"
      >
        <motion.header variants={fadeUp} className="mb-8 text-center">
          <h1 className="text-[2rem] leading-tight font-semibold md:text-[2.35rem]">
            {title}
          </h1>
          <p className="mt-2.5 text-[15.5px] text-muted">{subtitle}</p>
        </motion.header>

        <motion.div
          variants={fadeUp}
          className="w-full max-w-[26rem] rounded-2xl border border-line bg-surface p-7 shadow-[0_1px_2px_rgba(13,21,33,0.04),0_16px_40px_-24px_rgba(13,21,33,0.18)] md:p-8"
        >
          {children}
        </motion.div>

        <motion.p variants={fadeUp} className="mt-6 text-[14.5px] text-muted">
          {footer}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10">
          <Link
            to="/"
            className="text-[13.5px] text-faint transition-colors duration-200 hover:text-accent"
          >
            ← Back to home
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
