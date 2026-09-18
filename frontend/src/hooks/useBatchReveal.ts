import { useReducedMotion } from 'framer-motion'
import type { RefObject } from 'react'
import { ScrollTrigger, gsap, useGSAP } from '../lib/gsap'

/**
 * Reveals a list of elements one at a time as they scroll into view.
 *
 * The companion to <ScrollReveal>, which handles text word-by-word: this is
 * for whole cards or rows. ScrollTrigger.batch() gives each element its own
 * trigger, so items arrive as you reach them rather than all firing when the
 * container's top edge appears.
 */
export function useBatchReveal(
  scope: RefObject<HTMLElement | null>,
  selector: string,
  dependencies: unknown[] = [],
) {
  const reduced = useReducedMotion()

  useGSAP(
    () => {
      if (reduced) return

      const targets = scope.current?.querySelectorAll<HTMLElement>(selector)
      if (!targets || targets.length === 0) return

      gsap.set(targets, { opacity: 0, y: 26 })

      ScrollTrigger.batch(targets, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.08,
            overwrite: true,
          }),
      })
    },
    // revertOnUpdate clears the previous set's triggers before new content
    // paints, otherwise they leak every time the list changes.
    { scope, dependencies: [...dependencies, reduced], revertOnUpdate: true },
  )
}
