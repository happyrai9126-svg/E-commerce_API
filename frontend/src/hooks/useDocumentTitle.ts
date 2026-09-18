import { useEffect } from 'react'

const BRAND = 'Noor'

/**
 * Sets the browser tab title for a page. Pass the page name only —
 * useDocumentTitle('Cart') renders "Noor — Cart". Omit it for the home page.
 */
export function useDocumentTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${BRAND} — ${page}` : `${BRAND} — A calmer way to shop`
  }, [page])
}
