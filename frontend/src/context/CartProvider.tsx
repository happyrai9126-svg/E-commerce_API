import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  addCartItem,
  cartCount,
  cartTotal,
  deleteCartItem,
  fetchCart,
  patchCartQuantity,
  placeOrder,
} from '../lib/cart'
import { parseApiError } from '../lib/errors'
import type { CartItem, PurchasePayload } from '../types/api'
import { CartContext } from './cart-context'
import type { AddResult, CartStatus } from './cart-context'

/**
 * Owns the shopping cart for the whole app.
 *
 * Loads the cart when the user signs in and clears it when they sign out,
 * exposes add / setQuantity / remove / checkout, and derives the count and
 * total the navbar and cart page read. Quantity and removal updates are
 * applied optimistically and reconciled against the server on failure.
 * Renders nothing of its own — it only provides context.
 *
 * @param children - The subtree that gets access to the cart context.
 */
export default function CartProvider({ children }: { children: ReactNode }) {
  const { status: authStatus } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [status, setStatus] = useState<CartStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setStatus('loading')
    try {
      const data = await fetchCart()
      setItems(data)
      setStatus('ready')
      setError(null)
    } catch (err) {
      setError(parseApiError(err, 'Could not load your cart.').message)
      setStatus('error')
    }
  }, [])

  /* Load on sign-in; drop everything on sign-out so the badge can't linger. */
  useEffect(() => {
    if (authStatus === 'authenticated') {
      void refresh()
    } else if (authStatus === 'anonymous') {
      setItems([])
      setStatus('idle')
      setError(null)
    }
  }, [authStatus, refresh])

  const isInCart = useCallback(
    (imageUrl: string) => items.some((item) => item.image_url === imageUrl),
    [items],
  )

  const addToCart = useCallback(
    async (payload: PurchasePayload): Promise<AddResult> => {
      // cart_save() silently returns the existing row when image_url already
      // exists for this user — same 201, same "successfully added to cart"
      // message — so a duplicate is only detectable from what we already hold.
      if (isInCart(payload.image_url)) return 'duplicate'

      await addCartItem(payload)
      await refresh()
      return 'added'
    },
    [isInCart, refresh],
  )

  const setQuantity = useCallback(
    async (item: CartItem, quantity: number) => {
      if (item.id === undefined || quantity < 1) return

      const previous = items
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, quantity } : entry,
        ),
      )

      try {
        await patchCartQuantity(item.id, quantity)
      } catch {
        // PATCH commits the row and *then* fails response validation (it
        // returns the Cart object against a { message } response_model), so a
        // failure here does not mean the change was rejected. Re-read the
        // server and only complain if it genuinely disagrees.
        try {
          const fresh = await fetchCart()
          setItems(fresh)
          const saved = fresh.find((entry) => entry.id === item.id)
          if (saved?.quantity !== quantity) {
            setError('Could not update that quantity.')
          }
        } catch {
          setItems(previous)
          setError('Could not update that quantity.')
        }
      }
    },
    [items],
  )

  const removeItem = useCallback(
    async (item: CartItem) => {
      if (item.id === undefined) return

      const previous = items
      setItems((current) => current.filter((entry) => entry.id !== item.id))

      try {
        await deleteCartItem(item.id)
      } catch (err) {
        setItems(previous)
        setError(parseApiError(err, 'Could not remove that item.').message)
      }
    },
    [items],
  )

  const checkout = useCallback(async () => {
    const snapshot = items
    if (snapshot.length === 0) return { ordered: 0, total: 0 }

    const total = cartTotal(snapshot)
    let ordered = 0

    try {
      // There is no bulk order endpoint — POST /order/Ecommerce takes a single
      // item — so the cart is placed one row at a time.
      for (const item of snapshot) {
        await placeOrder({
          title: item.title,
          image_url: item.image_url,
          price: item.price,
          quantity: item.quantity,
        })
        ordered += 1
      }
    } catch (err) {
      await refresh()
      const message = parseApiError(err, 'Could not place your order.').message
      // Backend details rarely end in punctuation; don't run two sentences together.
      const sentence = /[.!?]$/.test(message) ? message : `${message}.`
      throw new Error(
        ordered > 0
          ? `${sentence} ${ordered} of ${snapshot.length} items were ordered.`
          : sentence,
      )
    }

    // Placing an order does not empty the cart server-side, so clear the rows
    // we just bought. A failed delete is not fatal — refresh() re-reads truth.
    await Promise.allSettled(
      snapshot
        .filter((item) => item.id !== undefined)
        .map((item) => deleteCartItem(item.id as number)),
    )
    await refresh()

    return { ordered, total }
  }, [items, refresh])

  const value = useMemo(
    () => ({
      items,
      status,
      error,
      count: cartCount(items),
      total: cartTotal(items),
      // The Cart model has an id but CartLookResponse omits it, so there is
      // nothing to address PATCH/DELETE with until that schema exposes it.
      canModifyItems: items.length === 0 || items.every((i) => i.id !== undefined),
      refresh,
      addToCart,
      setQuantity,
      removeItem,
      checkout,
      isInCart,
    }),
    [items, status, error, refresh, addToCart, setQuantity, removeItem, checkout, isInCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
