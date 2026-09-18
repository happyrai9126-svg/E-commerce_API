import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import { useBatchReveal } from '../hooks/useBatchReveal'
import { fetchOrders } from '../lib/cart'
import { parseApiError } from '../lib/errors'
import { formatDateTime } from '../lib/format'
import { transitions } from '../lib/motion'
import { formatPrice } from '../lib/products'
import type { OrderItem } from '../types/api'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/** Where the orders fetch currently stands. */
type Status = 'loading' | 'ready' | 'error'

/**
 * Purchase history page at `/orders`.
 *
 * Fetches the user's orders on mount, sorts them newest-first, and renders
 * them as a revealing list alongside an order-count and total-spent summary.
 * Falls back to {@link OrdersSkeleton} while loading, {@link NoOrders} when
 * there is nothing to show, and a retry prompt on failure. Owns the orders,
 * status and retry state. Sits behind <RequireAuth>, and takes no props.
 */
export default function Orders() {
  useDocumentTitle('Orders')

  const [orders, setOrders] = useState<OrderItem[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    fetchOrders()
      .then((data) => {
        if (cancelled) return
        setOrders(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setError(parseApiError(err, 'Could not load your orders.').message)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const sorted = useMemo(() => {
    // order_look() has no ORDER BY, so the API hands back insertion order.
    // Reversing first means rows written in the same second — a cart checkout
    // writes several — keep newest-first once the stable sort runs.
    return [...orders]
      .reverse()
      .sort(
        (a, b) =>
          new Date(b.ordered_at).getTime() - new Date(a.ordered_at).getTime(),
      )
  }, [orders])

  useBatchReveal(list, '[data-order]', [sorted])

  const totalSpent = useMemo(
    () => sorted.reduce((sum, o) => sum + o.price * o.quantity, 0),
    [sorted],
  )

  return (
    <section className="relative overflow-hidden">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transitions.soft}
        className="pointer-events-none absolute inset-x-0 -top-44 h-[26rem] bg-[radial-gradient(55%_55%_at_50%_0%,var(--color-accent-soft)_0%,transparent_70%)]"
      />

      <div className="shell relative pt-20 pb-28 md:pt-24">
        <header className="mx-auto max-w-2xl text-center">
          <ScrollReveal
            as="p"
            className="text-[13px] font-medium tracking-[0.14em] text-accent uppercase"
          >
            Orders
          </ScrollReveal>
          <ScrollReveal
            as="h1"
            className="mt-4 text-[2.25rem] leading-[1.1] font-semibold md:text-[3rem]"
          >
            Everything you've bought.
          </ScrollReveal>
        </header>

        <div className="mx-auto mt-12 max-w-3xl">
          {status === 'loading' && <OrdersSkeleton />}

          {status === 'error' && (
            <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50/60 px-8 py-12 text-center">
              <h2 role="alert" className="text-[16px] font-semibold text-ink">
                Couldn't load your orders
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {error}
              </p>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="mt-6 rounded-full bg-accent px-5 py-2.5 text-[14.5px] font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
              >
                Try again
              </button>
            </div>
          )}

          {status === 'ready' && sorted.length === 0 && <NoOrders />}

          {status === 'ready' && sorted.length > 0 && (
            <>
              <div className="mb-5 flex items-baseline justify-between">
                <p className="text-[13.5px] text-faint">
                  {sorted.length} order{sorted.length === 1 ? '' : 's'}
                </p>
                <p className="text-[13.5px] text-faint">
                  Total spent{' '}
                  <span className="font-semibold text-ink tabular-nums">
                    {formatPrice(totalSpent)}
                  </span>
                </p>
              </div>

              <ul ref={list} className="flex flex-col gap-3">
                {sorted.map((order, i) => (
                  <li
                    key={`${order.image_url}-${order.ordered_at}-${i}`}
                    data-order
                    className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3 sm:p-4"
                  >
                    <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-tint sm:size-24">
                      <img
                        src={order.image_url}
                        alt={order.title}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="line-clamp-2 text-[14.5px] leading-snug font-medium text-ink">
                        {order.title}
                      </h2>
                      <p className="mt-1.5 text-[13px] text-faint tabular-nums">
                        {formatPrice(order.price)} × {order.quantity}
                      </p>
                      <p className="mt-2 text-[12.5px] text-faint">
                        Ordered {formatDateTime(order.ordered_at)}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[13px] text-faint">Paid</p>
                      <p className="mt-1 text-[15.5px] font-semibold text-accent tabular-nums">
                        {formatPrice(order.price * order.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                to="/shop"
                className="mt-6 block rounded-full border border-line-strong py-2.5 text-center text-[14.5px] font-medium text-ink transition-colors duration-200 hover:border-accent-ring hover:text-accent"
              >
                Keep browsing
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * Placeholder shown when the user has not ordered anything yet.
 *
 * Renders a parcel icon, a short explanation and a link through to the shop.
 * Takes no props.
 */
function NoOrders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transitions.soft}
      className="mx-auto max-w-md rounded-2xl border border-line bg-surface px-8 py-14 text-center"
    >
      <span
        aria-hidden
        className="mx-auto grid size-10 place-items-center rounded-full bg-accent-soft"
      >
        <svg viewBox="0 0 20 20" fill="none" className="size-4.5 text-accent">
          <path
            d="M4 6.5 10 3l6 3.5v7L10 17l-6-3.5v-7Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="m4 6.5 6 3.5 6-3.5M10 10v7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <h2 className="mt-5 text-[17px] font-semibold text-ink">No orders yet</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted text-pretty">
        Once you buy something it'll show up here, with the date and what you
        paid.
      </p>

      <Link
        to="/shop"
        className="mt-6 inline-flex rounded-full bg-accent px-5 py-2.5 text-[14.5px] font-medium text-white transition-colors duration-200 hover:bg-accent-hover"
      >
        Start browsing
      </Link>
    </motion.div>
  )
}

/**
 * Pulsing placeholder rows shown while the order history is loading.
 * Takes no props.
 */
function OrdersSkeleton() {
  return (
    <ul className="flex flex-col gap-3" aria-label="Loading orders">
      {Array.from({ length: 3 }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4"
        >
          <div className="size-24 shrink-0 animate-pulse rounded-xl bg-tint" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/5 animate-pulse rounded-full bg-tint" />
            <div className="h-3 w-1/4 animate-pulse rounded-full bg-tint" />
            <div className="h-3 w-2/5 animate-pulse rounded-full bg-tint" />
          </div>
        </li>
      ))}
    </ul>
  )
}
