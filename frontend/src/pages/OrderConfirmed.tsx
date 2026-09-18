import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import { fadeUp, stagger, transitions } from '../lib/motion'
import { formatPrice } from '../lib/products'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/**
 * Landing spot after "Buy now". Deliberately minimal — the full orders
 * history is Phase 5.
 */
export default function OrderConfirmed() {
  useDocumentTitle('Order placed')

  const location = useLocation()
  // Single-product "Buy now" sends {title, quantity}; a cart checkout sends
  // {itemCount, total}.
  const state = location.state as {
    title?: string
    quantity?: number
    itemCount?: number
    total?: number
  } | null

  const summary = state?.title
    ? `${state.quantity ?? 1} × ${state.title} is on its way.`
    : state?.itemCount
      ? `${state.itemCount} item${state.itemCount === 1 ? '' : 's'}${
          state.total ? ` · ${formatPrice(state.total)}` : ''
        } — on the way.`
      : 'Your order is on its way.'

  return (
    <section className="relative overflow-hidden">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transitions.soft}
        className="pointer-events-none absolute inset-x-0 -top-44 h-[28rem] bg-[radial-gradient(55%_55%_at_50%_0%,var(--color-accent-soft)_0%,transparent_70%)]"
      />

      <motion.div
        variants={stagger(0.08, 0.05)}
        initial="hidden"
        animate="show"
        className="shell relative flex min-h-[calc(100dvh-4.5rem)] flex-col items-center justify-center py-20 text-center"
      >
        <motion.span
          variants={fadeUp}
          className="grid size-14 place-items-center rounded-full bg-accent-soft"
        >
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-6 text-accent"
          >
            <motion.path
              d="m5 12.5 4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
            />
          </motion.svg>
        </motion.span>

        <ScrollReveal
          as="h1"
          className="mt-7 max-w-xl text-[2.25rem] leading-[1.1] font-semibold md:text-[2.75rem]"
        >
          Order placed.
        </ScrollReveal>

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-md text-[16.5px] leading-relaxed text-muted text-pretty"
        >
          {summary}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className="rounded-full bg-accent px-5 py-2.5 text-[14.5px] font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
          >
            Keep browsing
          </Link>
          <Link
            to="/orders"
            className="rounded-full border border-line-strong px-5 py-2.5 text-[14.5px] font-medium text-ink transition-colors duration-200 hover:border-accent-ring hover:text-accent"
          >
            View orders
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
