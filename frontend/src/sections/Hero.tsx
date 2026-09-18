import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fade, fadeUp, stagger, transitions } from '../lib/motion'

/** The three figures shown in the row beneath the hero's call to action. */
const stats = [
  { value: '2,400+', label: 'Pieces in the catalogue' },
  { value: '48h', label: 'Average delivery window' },
  { value: '30 days', label: 'No-questions returns' },
]

/**
 * Landing-page hero.
 *
 * Renders a soft radial wash behind a staggered column: an eyebrow line, the
 * headline and supporting copy, the Shop and sign-up calls to action, and the
 * {@link stats} row. Everything animates in on mount rather than on scroll,
 * since it sits above the fold. Takes no props.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft blue wash behind the fold */}
      <motion.div
        aria-hidden
        variants={fade}
        initial="hidden"
        animate="show"
        className="pointer-events-none absolute inset-x-0 -top-40 h-[36rem] bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-accent-soft)_0%,transparent_70%)]"
      />

      <motion.div
        variants={stagger(0.09, 0.1)}
        initial="hidden"
        animate="show"
        className="shell relative flex flex-col items-center pt-24 pb-28 text-center md:pt-32 md:pb-36"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-accent-ring/70 bg-surface/70 px-3.5 py-1.5 text-[13px] font-medium text-accent"
        >
          <span className="size-1.5 rounded-full bg-accent" />
          New this week — the winter linen edit
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="mt-7 max-w-3xl text-[2.75rem] leading-[1.06] font-semibold md:text-[4.25rem]"
        >
          A calmer way to find
          <br className="hidden sm:block" />{' '}
          <span className="text-accent">what you were after</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted text-pretty"
        >
          A small, considered catalogue of things for the home — ceramics, linen,
          lighting, and the odd good chair. Search it in seconds, without wading
          through ten thousand near-identical listings.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }} transition={transitions.quick}>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white shadow-[0_1px_2px_rgba(37,99,235,0.3),0_8px_24px_-12px_rgba(37,99,235,0.6)] transition-colors duration-200 hover:bg-accent-hover"
            >
              Start browsing
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
                className="size-3.5 translate-y-px"
              >
                <path
                  d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>

          <Link
            to="/collections"
            className="inline-flex items-center rounded-full border border-line-strong bg-surface px-6 py-3 text-[15px] font-medium text-ink transition-colors duration-200 hover:border-accent-ring hover:text-accent"
          >
            See collections
          </Link>
        </motion.div>

        <motion.dl
          variants={fadeUp}
          className="mt-20 grid w-full max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface px-6 py-7">
              <dt className="text-[22px] font-semibold tracking-tight text-ink">
                {stat.value}
              </dt>
              <dd className="mt-1.5 text-[13.5px] text-faint">{stat.label}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  )
}
