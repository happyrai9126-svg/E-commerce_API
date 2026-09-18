import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Single place where GSAP plugins are registered. Import gsap from here (not
 * from 'gsap' directly) so ScrollTrigger is guaranteed to be wired up.
 *
 * GSAP owns the two scroll effects — the pinned hero story and the word-by-word
 * reveal. Framer Motion still owns everything else: page transitions, hover
 * states, buttons, form feedback.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Reads a design token off :root so animations stay tied to the palette.
 *
 * @param name - The CSS custom property to read, e.g. '--color-accent'.
 * @param fallback - Value returned when the property is unset or there is no
 *   document (server-side rendering).
 * @returns The resolved token value, trimmed, or `fallback`.
 */
export function token(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  return value || fallback
}

export { gsap, ScrollTrigger, useGSAP }
