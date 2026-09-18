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
 *
 * Owns the GSAP triggers for the matched elements and reverts them whenever
 * the dependencies change, so a re-rendered list does not leak triggers. It
 * holds no state and returns nothing; the effect is entirely on the DOM inside
 * `scope`. Skipped when the viewer prefers reduced motion.
 *
 * @param scope - Ref to the container whose descendants should be revealed.
 * @param selector - CSS selector matching the elements to animate, e.g. '[data-card]'.
 * @param dependencies - Values that, when changed, rebuild the triggers —
 *   typically the list being rendered.
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
