import { useEffect } from 'react'

/** Prefix applied to every page title. */
const BRAND = 'Noor'

/**
 * Sets the browser tab title for a page. Pass the page name only —
 * useDocumentTitle('Cart') renders "Noor — Cart". Omit it for the home page.
 *
 * Writes to document.title as a side effect whenever `page` changes; it holds
 * no state and returns nothing.
 *
 * @param page - The page name to append after the brand, or omitted for the
 *   home page's tagline title.
 */
export function useDocumentTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${BRAND} — ${page}` : `${BRAND} — A calmer way to shop`
  }, [page])
}
