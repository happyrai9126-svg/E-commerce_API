/**
 * API client for the cart and order endpoints, plus the two totals the cart
 * and navbar derive from a list of items.
 */
import { api } from './api'
import type { CartItem, MessageResponse, OrderItem, PurchasePayload } from '../types/api'

/* All of these require a Bearer token; the axios interceptor attaches it. */

/** POST /cart/Ecommerce → 201 { message } */
export async function addCartItem(payload: PurchasePayload) {
  const { data } = await api.post<MessageResponse>('/cart/Ecommerce', payload)
  return data
}

/** GET /cart/Ecommerce → 200 CartLookResponse[] */
export async function fetchCart() {
  const { data } = await api.get<CartItem[]>('/cart/Ecommerce')
  return data
}

/** PATCH /cart/Ecommerce/{cart_id} → declared { message }, see note below. */
export async function patchCartQuantity(cartId: number, quantity: number) {
  const { data } = await api.patch<MessageResponse>(
    `/cart/Ecommerce/${cartId}`,
    { quantity },
  )
  return data
}

/** DELETE /cart/Ecommerce/{cart_id} → 200 { message }, 404 if not found. */
export async function deleteCartItem(cartId: number) {
  const { data } = await api.delete<MessageResponse>(
    `/cart/Ecommerce/${cartId}`,
  )
  return data
}

/** POST /order/Ecommerce → 200 { message } */
export async function placeOrder(payload: PurchasePayload) {
  const { data } = await api.post<MessageResponse>('/order/Ecommerce', payload)
  return data
}

/** GET /order/Ecommerce → 200 OrderLookResponse[] */
export async function fetchOrders() {
  const { data } = await api.get<OrderItem[]>('/order/Ecommerce')
  return data
}

/**
 * Sum the price of every line in a cart.
 *
 * @param items - The cart items to total.
 * @returns The combined `price * quantity` across all items.
 */
export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

/**
 * Count the total number of units in a cart.
 *
 * @param items - The cart items to count.
 * @returns The summed quantity across all items, used for the navbar badge.
 */
export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
