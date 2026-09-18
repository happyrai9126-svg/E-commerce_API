import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import ProductGrid, { GRID_CLASSES } from '../components/products/ProductGrid'
import ProductSkeleton from '../components/products/ProductSkeleton'
import SearchField from '../components/products/SearchField'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { parseApiError } from '../lib/errors'
import { transitions } from '../lib/motion'
import { searchProducts } from '../lib/products'
import type { Product } from '../types/api'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/** Where the search currently stands: `idle` before any query is entered. */
type Status = 'idle' | 'loading' | 'success' | 'error'

/** Starter queries offered as chips before the shopper types anything. */
const SUGGESTIONS = ['ceramics', 'linen', 'desk lamp', 'oak stool', 'wool throw']

/** The backend hardcodes per_page=9, so this is the most we can ever show. */
const SKELETON_COUNT = 9

/**
 * Product search page at `/shop`.
 *
 * Renders the search field over either the results grid, a skeleton grid while
 * loading, or an empty/error state. Owns the query input, the debounced query
 * actually sent to the API, the results and the request status; the live query
 * is mirrored into `?q=` so a search can be shared or reloaded, and each new
 * keystroke aborts the request it supersedes. Takes no props.
 */
export default function Shop() {
  useDocumentTitle('Shop')

  const [params, setParams] = useSearchParams()
  const [input, setInput] = useState(() => params.get('q') ?? '')
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<Status>(() =>
    params.get('q') ? 'loading' : 'idle',
  )
  const [error, setError] = useState<string | null>(null)
  const [activeQuery, setActiveQuery] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const query = useDebouncedValue(input.trim(), 400)
  const setParamsRef = useRef(setParams)
  setParamsRef.current = setParams

  /* Keep ?q= in step with the debounced query so a search is shareable.
     Deliberately keyed on `query` alone — react-router's setter identity is
     not guaranteed stable, and depending on it would refire the fetch. */
  useEffect(() => {
    setParamsRef.current(query ? { q: query } : {}, { replace: true })
  }, [query])

  useEffect(() => {
    if (!query) {
      setStatus('idle')
      setProducts([])
      setError(null)
      setActiveQuery('')
      return
    }

    const controller = new AbortController()
    setStatus('loading')
    setError(null)

    searchProducts(query, controller.signal)
      .then((data) => {
        setProducts(data)
        setActiveQuery(query)
        setStatus('success')
      })
      .catch((err) => {
        // A superseded keystroke aborts the previous request — not an error.
        if (axios.isCancel(err)) return
        setError(
          parseApiError(err, 'Search is unavailable right now.').message,
        )
        setStatus('error')
      })

    return () => controller.abort()
  }, [query, reloadKey])

  const showSkeletons = status === 'loading'
  const showEmptyResult = status === 'success' && products.length === 0

  return (
    <section className="relative overflow-hidden">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transitions.soft}
        className="pointer-events-none absolute inset-x-0 -top-44 h-[30rem] bg-[radial-gradient(55%_55%_at_50%_0%,var(--color-accent-soft)_0%,transparent_70%)]"
      />

      <div className="shell relative pt-20 pb-28 md:pt-24">
        <header className="mx-auto max-w-2xl text-center">
          <ScrollReveal
            as="p"
            className="text-[13px] font-medium tracking-[0.14em] text-accent uppercase"
          >
            Browse
          </ScrollReveal>

          <ScrollReveal
            as="h1"
            className="mt-4 text-[2.25rem] leading-[1.1] font-semibold md:text-[3rem]"
          >
            Find the thing you came for.
          </ScrollReveal>

          <ScrollReveal
            as="p"
            className="mt-5 text-[16.5px] leading-relaxed text-muted text-pretty"
          >
            Type anything and the catalogue responds as you go. No account
            needed to look around.
          </ScrollReveal>
        </header>

        <div className="mx-auto mt-10 max-w-xl">
          <SearchField value={input} onChange={setInput} busy={showSkeletons} />

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[13px] text-faint">Try</span>
            {SUGGESTIONS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setInput(term)}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-muted transition-colors duration-200 hover:border-accent-ring hover:bg-accent-soft hover:text-accent"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results meta */}
        <div className="mt-14 min-h-6">
          <AnimatePresence mode="wait">
            {status === 'success' && products.length > 0 && (
              <motion.p
                key={activeQuery}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={transitions.quick}
                className="text-[13.5px] text-faint"
              >
                {products.length} result{products.length === 1 ? '' : 's'} for{' '}
                <span className="font-medium text-ink">“{activeQuery}”</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-5">
          {showSkeletons && (
            <ul className={GRID_CLASSES} aria-label="Loading results">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <li key={i}>
                  <ProductSkeleton />
                </li>
              ))}
            </ul>
          )}

          {status === 'success' && products.length > 0 && (
            <ProductGrid key={activeQuery} products={products} />
          )}

          {status === 'idle' && (
            <EmptyState
              title="Nothing searched yet"
              body="Start typing above, or pick one of the suggestions to see what turns up."
            />
          )}

          {showEmptyResult && (
            <EmptyState
              title={`No matches for “${activeQuery}”`}
              body="Try a broader word — a material, a colour, or the kind of thing rather than the exact model."
            />
          )}

          {status === 'error' && (
            <EmptyState
              title="That search didn't come back"
              body={error ?? 'Search is unavailable right now.'}
              tone="error"
              action={{
                label: 'Try again',
                onClick: () => setReloadKey((k) => k + 1),
              }}
            />
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * Centred placeholder card shown in place of the results grid.
 *
 * Covers all three no-results cases: nothing searched yet, a search that
 * matched nothing, and a failed request.
 *
 * @param title - Headline for the state.
 * @param body - Supporting line beneath the headline.
 * @param tone - `quiet` for the neutral styling, `error` for the red one.
 * @param action - Optional button, e.g. retrying a failed search.
 */
function EmptyState({
  title,
  body,
  tone = 'quiet',
  action,
}: {
  title: string
  body: string
  tone?: 'quiet' | 'error'
  action?: { label: string; onClick: () => void }
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transitions.soft}
      className={`mx-auto max-w-md rounded-2xl border px-8 py-14 text-center ${
        tone === 'error'
          ? 'border-red-200 bg-red-50/60'
          : 'border-line bg-surface'
      }`}
    >
      <span
        aria-hidden
        className={`mx-auto grid size-10 place-items-center rounded-full ${
          tone === 'error' ? 'bg-red-100' : 'bg-accent-soft'
        }`}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className={`size-4.5 ${tone === 'error' ? 'text-red-500' : 'text-accent'}`}
        >
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="m13.5 13.5 3 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <h2 className="mt-5 text-[17px] font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted text-pretty">
        {body}
      </p>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-6 rounded-full bg-accent px-5 py-2.5 text-[14.5px] font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
