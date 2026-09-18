import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { placeOrder } from '../../lib/cart'
import { parseApiError } from '../../lib/errors'
import { transitions } from '../../lib/motion'
import { displayTitle, formatPrice } from '../../lib/products'
import type { Product } from '../../types/api'
import ScrollReveal from '../ScrollReveal'
import QuantityStepper from '../ui/QuantityStepper'

/** Inline status line under the buttons: success, a neutral note, or an error. */
type Feedback = { tone: 'ok' | 'note' | 'bad'; text: string } | null

/**
 * Displays a single product card with image, title, price, a quantity stepper,
 * and "Add to cart" / "Buy now" buttons.
 *
 * The image fades in once loaded and falls back to an "Image unavailable" note
 * if it errors. Both actions send signed-out visitors to /login first,
 * remembering the current page so they come back here. Feedback from either
 * action is shown inline beneath the buttons; "Buy now" navigates to the
 * confirmation page on success.
 *
 * @param product - The product to display (title, image_url, price).
 */
export default function ProductCard({ product }: { product: Product }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [pending, setPending] = useState<'cart' | 'order' | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // CartCreate.title is a required str but search titles are often null, so
  // the display fallback is what actually gets sent.
  const title = displayTitle(product.title)

  const payload = {
    title,
    image_url: product.image_url,
    price: product.price,
    quantity,
  }

  /** Send the visitor to /login, remembering this page so they return to it. */
  function requireLogin() {
    navigate('/login', {
      replace: false,
      state: { from: `${location.pathname}${location.search}` },
    })
  }

  /**
   * Add the chosen quantity to the cart and report the outcome inline.
   *
   * Resets the stepper to 1 on a fresh add, and says so instead when the
   * product was already in the cart.
   */
  async function handleAddToCart() {
    if (!user) return requireLogin()

    setPending('cart')
    setFeedback(null)
    try {
      const result = await addToCart(payload)
      if (result === 'duplicate') {
        setFeedback({ tone: 'note', text: 'Already in your cart' })
      } else {
        setFeedback({ tone: 'ok', text: 'Added to cart' })
        setQuantity(1)
      }
    } catch (err) {
      setFeedback({
        tone: 'bad',
        text: parseApiError(err, 'Could not add that.').message,
      })
    } finally {
      setPending(null)
    }
  }

  /**
   * Order the chosen quantity immediately, bypassing the cart, then navigate
   * to the confirmation page. Failures stay on the card as inline feedback.
   */
  async function handleBuyNow() {
    if (!user) return requireLogin()

    setPending('order')
    setFeedback(null)
    try {
      await placeOrder(payload)
      navigate('/order/confirmed', { state: { title, quantity } })
    } catch (err) {
      setFeedback({
        tone: 'bad',
        text: parseApiError(err, 'Could not place that order.').message,
      })
      setPending(null)
    }
  }

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={transitions.quick}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[border-color,box-shadow] duration-300 hover:border-accent-ring hover:shadow-[0_1px_2px_rgba(13,21,33,0.04),0_18px_40px_-28px_rgba(37,99,235,0.45)]"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-tint">
        {!failed && (
          <img
            src={product.image_url}
            alt={title}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`size-full object-cover transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {!loaded && !failed && (
          <div className="absolute inset-0 animate-pulse bg-tint" />
        )}

        {failed && (
          <div className="absolute inset-0 grid place-items-center px-4 text-center">
            <span className="text-[12.5px] text-faint">Image unavailable</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <ScrollReveal
            as="h3"
            stagger={0.03}
            className="line-clamp-2 text-[14.5px] leading-snug font-medium text-ink"
          >
            {title}
          </ScrollReveal>

          <span className="shrink-0 text-[14.5px] font-semibold text-accent tabular-nums">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-2">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              disabled={pending !== null}
              label={`Quantity for ${title}`}
            />

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={pending !== null}
              className="h-9 flex-1 rounded-full bg-accent px-3 text-[13.5px] font-medium text-white transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending === 'cart' ? 'Adding…' : 'Add to cart'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={pending !== null}
            className="mt-2 h-9 w-full rounded-full border border-line-strong text-[13.5px] font-medium text-ink transition-colors duration-200 hover:border-accent-ring hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending === 'order' ? 'Placing order…' : 'Buy now'}
          </button>

          <AnimatePresence initial={false}>
            {feedback && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={transitions.quick}
                className={`overflow-hidden text-center text-[12.5px] ${
                  feedback.tone === 'ok'
                    ? 'text-accent'
                    : feedback.tone === 'note'
                      ? 'text-faint'
                      : 'text-red-600'
                }`}
              >
                {feedback.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  )
}
