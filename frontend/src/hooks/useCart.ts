import { useContext } from 'react'
import { CartContext } from '../context/cart-context'

/**
 * Access the cart context.
 *
 * @returns The cart state and actions from <CartProvider>: the current items,
 * derived count and total, and the add, update, remove and refresh callbacks.
 * @throws If called outside a <CartProvider> subtree.
 */
export function useCart() {
  const value = useContext(CartContext)
  if (!value) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return value
}
