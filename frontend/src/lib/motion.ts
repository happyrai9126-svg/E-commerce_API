import type { Transition, Variants } from 'framer-motion'

/**
 * Shared motion language. Everything is short, soft-eased and low-travel —
 * movement should be felt more than seen.
 */

export const easeOutSoft = [0.22, 1, 0.36, 1] as const

export const transitions = {
  soft: { duration: 0.55, ease: easeOutSoft } satisfies Transition,
  quick: { duration: 0.25, ease: easeOutSoft } satisfies Transition,
}

/** Fade in while rising a few pixels — the default entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: transitions.soft },
}

/** Plain fade, for things that shouldn't move (images, rules, backdrops). */
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transitions.soft },
}

/** Parent wrapper that walks its children in one at a time. */
export const stagger = (step = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: step, delayChildren: delay },
  },
})

/** Viewport config for scroll reveals: fire once, slightly before fully in view. */
export const revealViewport = { once: true, margin: '-80px' } as const
