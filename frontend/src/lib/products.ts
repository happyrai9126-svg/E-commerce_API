import { api } from './api'
import type { Product } from '../types/api'

/**
 * Currency is a frontend decision — the backend stores a bare int (a random
 * 1999–9999). Change these two lines to re-denominate the whole app.
 */
const LOCALE = 'en-US'
const CURRENCY = 'USD'

const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
})

/**
 * Render a raw integer price as a localised currency string.
 *
 * @param price - The bare integer price as stored by the backend.
 * @returns The formatted price, e.g. `"$4,312"`.
 */
export function formatPrice(price: number) {
  return priceFormatter.format(price)
}

/** Unsplash's alt_description is often null; give the card something to show. */
export function displayTitle(title: string | null) {
  const trimmed = title?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : 'Untitled piece'
}

/**
 * GET /search/Ecommerce?search=<query>
 *
 * `search` is a required query param (no default), so an empty query is a 422
 * — callers must not fire this with a blank string. Returns at most 7 items;
 * the backend hardcodes per_page=7.
 */
export async function searchProducts(query: string, signal?: AbortSignal) {
  const { data } = await api.get<Product[]>('/search/Ecommerce', {
    params: { search: query },
    signal,
  })
  return data
}
