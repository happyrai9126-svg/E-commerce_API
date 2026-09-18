import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import QuantityStepper from '../components/ui/QuantityStepper'
import { useCart } from '../hooks/useCart'
import { transitions } from '../lib/motion'
import { formatPrice } from '../lib/products'
import type { CartItem } from '../types/api'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Cart() {
  useDocumentTitle('Cart')

  const { items, status, error, total, count, canModifyItems, setQuantity, removeItem, checkout, refresh } =
    useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const loading = status === 'loading' && items.length === 0

  async function handleBuyNow() {
    setPlacing(true)
    setCheckoutError(null)
    try {
      const { ordered, total: spent } = await checkout()
      navigate('/order/confirmed', { state: { itemCount: ordered, total: spent } })
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : 'Could not place your order.',
      )
      setPlacing(false)
    }
  }

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
            Your cart
          </ScrollReveal>
          <ScrollReveal
            as="h1"
            className="mt-4 text-[2.25rem] leading-[1.1] font-semibold md:text-[3rem]"
          >
            Everything you set aside.
          </ScrollReveal>
        </header>

        {(error || checkoutError) && (
          <p
            role="alert"
            className="mx-auto mt-8 max-w-xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-[13.5px] text-red-700"
          >
            {checkoutError ?? error}
            <button
              type="button"
              onClick={() => {
                setCheckoutError(null)
                void refresh()
              }}
              className="ml-2 font-medium underline underline-offset-2 hover:no-underline"
            >
              Try again
            </button>
          </p>
        )}

        {!canModifyItems && items.length > 0 && (
          <p className="mx-auto mt-8 max-w-2xl rounded-xl border border-line bg-tint px-4 py-3 text-center text-[13px] leading-relaxed text-muted">
            Quantity and remove controls are inactive: the cart API doesn’t
            return an <code className="font-medium text-ink">id</code> for each
            item, so there’s nothing to address the update and delete endpoints
            with.
          </p>
        )}

        <div className="mx-auto mt-12 max-w-3xl">
          {loading && <CartSkeleton />}

          {!loading && items.length === 0 && <EmptyCart />}

          {items.length > 0 && (
            <>
              <ul className="flex flex-col gap-3">
                <AnimatePresence initial={false} mode="popLayout">
                  {items.map((item, i) => (
                    <CartRow
                      key={item.id ?? `${item.image_url}-${i}`}
                      item={item}
                      canModify={canModifyItems}
                      onQuantity={(q) => void setQuantity(item, q)}
                      onRemove={() => void removeItem(item)}
                    />
                  ))}
                </AnimatePresence>
              </ul>

              <motion.div
                layout
                transition={transitions.quick}
                className="mt-6 rounded-2xl border border-line bg-surface px-6 py-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14.5px] text-muted">
                    {count} item{count === 1 ? '' : 's'}
                  </span>
                  <div className="text-right">
                    <p className="text-[13px] text-faint">Total</p>
                    <motion.p
                      key={total}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={transitions.quick}
                      className="text-[24px] font-semibold text-ink tabular-nums"
                    >
                      {formatPrice(total)}
                    </motion.p>
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={placing}
                  whileHover={placing ? undefined : { y: -1 }}
                  whileTap={placing ? undefined : { y: 0 }}
                  transition={transitions.quick}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-[15px] font-medium text-white shadow-[0_1px_2px_rgba(37,99,235,0.3),0_8px_24px_-14px_rgba(37,99,235,0.7)] transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {placing && (
                    <motion.span
                      aria-hidden
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                      className="size-3.5 rounded-full border-2 border-current border-t-transparent opacity-70"
                    />
                  )}
                  {placing ? 'Placing order…' : `Buy now · ${formatPrice(total)}`}
                </motion.button>

                <Link
                  to="/shop"
                  className="mt-2.5 block rounded-full border border-line-strong py-2.5 text-center text-[14.5px] font-medium text-ink transition-colors duration-200 hover:border-accent-ring hover:text-accent"
                >
                  Keep browsing
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function CartRow({
  item,
  canModify,
  onQuantity,
  onRemove,
}: {
  item: CartItem
  canModify: boolean
  onQuantity: (quantity: number) => void
  onRemove: () => void
}) {
  return (
    <motion.li
      layout
      data-cart-row
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, scale: 0.97 }}
      transition={transitions.soft}
      className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-3 sm:p-4"
    >
      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-tint sm:size-24">
        <img
          src={item.image_url}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="line-clamp-2 text-[14.5px] leading-snug font-medium text-ink">
          {item.title}
        </h2>
        <p className="mt-1 text-[13px] text-faint tabular-nums">
          {formatPrice(item.price)} each
        </p>

        <div className="mt-3 flex items-center gap-3">
          <QuantityStepper
            value={item.quantity}
            onChange={onQuantity}
            // "−" at 1 removes the row rather than bottoming out.
            onDecrementBelowMin={onRemove}
            disabled={!canModify}
            label={`Quantity for ${item.title}`}
          />
          <button
            type="button"
            onClick={onRemove}
            disabled={!canModify}
            className="text-[13px] font-medium text-faint transition-colors duration-200 hover:text-red-600 disabled:cursor-not-allowed disabled:hover:text-faint"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="shrink-0 self-stretch text-right">
        <p className="text-[13px] text-faint">Subtotal</p>
        <motion.p
          key={item.quantity}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.quick}
          className="mt-1 text-[15.5px] font-semibold text-accent tabular-nums"
        >
          {formatPrice(item.price * item.quantity)}
        </motion.p>
      </div>
    </motion.li>
  )
}

function EmptyCart() {
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
            d="M3 4h2l1.6 8.2a1.5 1.5 0 0 0 1.5 1.2h6.1a1.5 1.5 0 0 0 1.5-1.2L17 7H6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="16.5" r="1" fill="currentColor" />
          <circle cx="14.5" cy="16.5" r="1" fill="currentColor" />
        </svg>
      </span>

      <h2 className="mt-5 text-[17px] font-semibold text-ink">
        Your cart is empty
      </h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted text-pretty">
        Nothing set aside yet. Have a look around and add something you like.
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

function CartSkeleton() {
  return (
    <ul className="flex flex-col gap-3" aria-label="Loading cart">
      {Array.from({ length: 3 }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4"
        >
          <div className="size-24 shrink-0 animate-pulse rounded-xl bg-tint" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/5 animate-pulse rounded-full bg-tint" />
            <div className="h-3 w-1/4 animate-pulse rounded-full bg-tint" />
            <div className="mt-3 h-9 w-28 animate-pulse rounded-full bg-tint" />
          </div>
        </li>
      ))}
    </ul>
  )
}
