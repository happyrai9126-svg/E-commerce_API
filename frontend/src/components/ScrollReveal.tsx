import { useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import type { ElementType, ReactNode } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

/** Marks the spans the reveal animates. Also used by useWordReveal. */
export const WORD_ATTR = 'data-reveal-word'

/** Tuning options shared by {@link useWordReveal} and {@link ScrollReveal}. */
type WordRevealOptions = {
  /** Per-word offset in seconds; the total is capped so long paragraphs
   *  don't crawl. */
  stagger?: number
  /** Seconds to wait after the trigger fires. */
  delay?: number
  /** ScrollTrigger start position. */
  start?: string
  /** Replay every time it scrolls back into view. */
  repeat?: boolean
  disabled?: boolean
}

/**
 * Animates every [data-reveal-word] inside `scope` as it scrolls into view.
 * Use this directly when you need custom markup; use <ScrollReveal> for the
 * common case of plain text.
 *
 * Manages a single GSAP timeline bound to a ScrollTrigger on `scope`. It holds
 * no state and returns nothing — the effect is entirely on the DOM inside the
 * scope, and the trigger is torn down when the scope unmounts.
 *
 * @param scope - Ref to the element whose word spans should animate.
 * @param options - Stagger, delay, trigger start, repeat and disabled flags.
 */
export function useWordReveal(
  scope: React.RefObject<HTMLElement | null>,
  {
    stagger = 0.045,
    delay = 0,
    start = 'top 88%',
    repeat = false,
    disabled = false,
  }: WordRevealOptions = {},
) {
  useGSAP(
    () => {
      if (disabled) return

      // Queried off the scope element directly: useGSAP's scoping covers
      // selector text in gsap tweens, not gsap.utils.toArray.
      const words = scope.current?.querySelectorAll<HTMLElement>(
        `[${WORD_ATTR}]`,
      )
      if (!words || words.length === 0) return

      gsap.from(words, {
        yPercent: 45,
        opacity: 0,
        duration: 0.65,
        ease: 'power3.out',
        delay,
        // `amount` spreads the whole stagger across a fixed window, so a
        // 60-word paragraph finishes in the same time as a 6-word headline.
        stagger: { amount: Math.min(words.length * stagger, 0.85) },
        scrollTrigger: {
          trigger: scope.current,
          start,
          // These keys are spread in rather than set to undefined: GSAP fills
          // defaults with an `in` check, so a present-but-undefined
          // toggleActions survives and then throws on .split().
          ...(repeat
            ? { toggleActions: 'play none none reverse' }
            : { once: true }),
        },
      })
    },
    { scope, dependencies: [disabled, delay, start, repeat, stagger] },
  )
}

/** Props for {@link ScrollReveal}. */
type ScrollRevealProps = WordRevealOptions & {
  /** Plain text — it gets split on whitespace, one span per word. */
  children: string
  as?: ElementType
  className?: string
}

/**
 * Drop-in word-by-word scroll reveal for any headline or paragraph.
 *
 *   <ScrollReveal as="h2" className="text-3xl">Everything, in one place</ScrollReveal>
 *
 * Each word fades in and lifts slightly as the block enters the viewport.
 * Deliberately understated — this is polish, not the hero's storytelling.
 *
 * Renders the text as one span per word inside the chosen tag and hands those
 * spans to {@link useWordReveal}. When the viewer prefers reduced motion the
 * animation is skipped and the text renders plainly.
 *
 * @param children - Plain text; split on whitespace, one span per word.
 * @param as - Element type to render; defaults to a paragraph.
 * @param className - Classes applied to the rendered element.
 * @param options - Remaining {@link useWordReveal} tuning options.
 */
export default function ScrollReveal({
  children,
  as: Tag = 'p',
  className,
  ...options
}: ScrollRevealProps) {
  const scope = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useWordReveal(scope, { ...options, disabled: Boolean(reduced) })

  const words = children.split(/(\s+)/)

  return (
    <Tag ref={scope} className={className}>
      {words.map((chunk, i) =>
        /\s/.test(chunk) ? (
          // Whitespace stays outside the spans so words wrap naturally.
          <span key={i}>{chunk}</span>
        ) : (
          <span
            key={i}
            {...{ [WORD_ATTR]: true }}
            // inline-block is what makes the vertical shift possible; the
            // clip wrapper is skipped on purpose to keep descenders intact.
            className="inline-block will-change-[transform,opacity]"
          >
            {chunk}
          </span>
        ),
      )}
    </Tag>
  )
}

/**
 * Convenience wrapper for custom markup that supplies its own word spans.
 *
 * Renders an inline-block span tagged with {@link WORD_ATTR} so
 * {@link useWordReveal} picks it up alongside text-derived words.
 *
 * @param children - The word (or inline content) to animate as one unit.
 */
export function RevealWord({ children }: { children: ReactNode }) {
  return (
    <span
      {...{ [WORD_ATTR]: true }}
      className="inline-block will-change-[transform,opacity]"
    >
      {children}
    </span>
  )
}
