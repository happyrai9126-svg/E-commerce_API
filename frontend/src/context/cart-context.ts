import { createContext } from 'react'
import type { CartItem, PurchasePayload } from '../types/api'

export type CartStatus = 'idle' | 'loading' | 'ready' | 'error'

/** What happened when the user pressed "Add to cart". */
export type AddResult = 'added' | 'duplicate'

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

export const CartContext = createContext<CartContextValue | null>(null)
