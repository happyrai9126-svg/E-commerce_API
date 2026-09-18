/** Mirrors app/schemas/users.py :: Users_Response */
export type User = {
  id: number
  username: string
  email: string
  full_name: string
  phone_number: string
  is_active: boolean
  created_at: string
}

/** Mirrors app/schemas/users.py :: Users_Create */
export type SignupPayload = {
  username: string
  email: string
  full_name: string
  phone_number: string
  strong_password: string
}

/** Mirrors app/schemas/token.py :: Token */
export type TokenResponse = {
  access_token: string
  token_type: string
}

/**
 * Mirrors the dicts built in app/services/unsplash.py.
 *
 * GET /search/Ecommerce returns a bare array of these — no envelope, no id,
 * and no total count. `title` comes from Unsplash's alt_description, which is
 * frequently null. `price` is randomised per request, so the same query
 * returns different prices each time.
 */
export type Product = {
  title: string | null
  image_url: string
  price: number
}

/** Fields both CartCreate and OrderCreate accept. */
export type PurchasePayload = {
  title: string
  image_url: string
  price: number
  quantity: number
}

/**
 * Mirrors app/schemas/cart.py :: CartLookResponse.
 *
 * NOTE: `id` is optional here because CartLookResponse does not currently
 * expose it, even though the Cart model has one. Without it the frontend
 * cannot address PATCH/DELETE /cart/Ecommerce/{cart_id}. Adding
 * `id: Annotated[int, Field()]` to that schema activates the quantity and
 * remove controls with no frontend change.
 */
export type CartItem = {
  id?: number
  title: string
  image_url: string
  price: number
  quantity: number
  added_at: string
}

/** Mirrors app/schemas/order.py :: OrderLookResponse. */
export type OrderItem = {
  title: string
  image_url: string
  price: number
  quantity: number
  ordered_at: string
}

/** CartRead / CartDeleteResponse / OrderRead are all just { message }. */
export type MessageResponse = {
  message: string
}
