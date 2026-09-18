import { createContext } from 'react'
import type { CartItem, PurchasePayload } from '../types/api'

/**
 * Where the cart fetch currently stands: `idle` before sign-in, then
 * `loading`, and finally `ready` or `error`.
 */
export type CartStatus = 'idle' | 'loading' | 'ready' | 'error'

/** What happened when the user pressed "Add to cart". */
export type AddResult = 'added' | 'duplicate'

/** The cart state and actions <CartProvider> exposes through useCart(). */
export type CartContextValue = {
  items: CartItem[]
  status: CartStatus
  error: string | null
  /** Sum of quantities — what the navbar badge shows. */
  count: number
  total: number
  /** False when the API omits item ids, which disables quantity/remove. */
  canModifyItems: boolean
  refresh: () => Promise<void>
  addToCart: (payload: PurchasePayload) => Promise<AddResult>
  setQuantity: (item: CartItem, quantity: number) => Promise<void>
  removeItem: (item: CartItem) => Promise<void>
  /** Orders every row, then empties the cart. Resolves with what was bought. */
  checkout: () => Promise<{ ordered: number; total: number }>
  isInCart: (imageUrl: string) => boolean
}

/**
 * Cart context, `null` until a <CartProvider> supplies a value — which is why
 * useCart() throws when called outside the provider.
 */
export const CartContext = createContext<CartContextValue | null>(null)
